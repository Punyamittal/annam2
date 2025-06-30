from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import re
import requests
from Bio import Entrez, SeqIO
from io import StringIO
import google.generativeai as genai
import traceback

app = Flask(__name__)
CORS(app)

# ===================== 🔑 Configuration =====================
genai.configure(api_key="AIzaSyBw_cKorVsoKrrJ7Nmd23YprwBrTxbAu7M")  # Replace with your actual key
gemini_model = genai.GenerativeModel("gemini-2.5-flash-preview-05-20")
Entrez.email = "punya.m215@gmail.com"
ENSEMBL_BASE_URL = "https://rest.ensembl.org"
ENSEMBL_HEADERS = {"Content-Type": "application/json"}

# ===================== 🌾 Gene Mapping ======================
trait_species_db = {
    "rice": { "scientific_name": "oryza_sativa", "traits": { "drought resistance": {"ensembl_id":"LOC_Os06g03670","symbol":"DREB1A"}, "flood tolerance": {"ensembl_id":"LOC_Os09g11460","symbol":"SUB1A"}, "grain size": {"ensembl_id":"GW2","symbol":"GW2"} }},
    "wheat": { "scientific_name": "triticum_aestivum", "traits": { "rust resistance": {"ensembl_id":"TraesCS7D02G080300","symbol":"Lr34"}, "semi-dwarf": {"ensembl_id":"Rht-B1","symbol":"Rht1"}, "grain protein": {"ensembl_id":"TraesCS6B02G055700","symbol":"GPC-B1"} }},
    "maize": { "scientific_name": "zea_mays", "traits": { "drought resistance": {"ensembl_id":"Zm00001d052025","symbol":"ZmDREB2A"}, "vitamin a biofort": {"ensembl_id":"Zm00001d048183","symbol":"crtRB1"}, "pest resistance": {"ensembl_id":"Zm00001d015758","symbol":"Bt1"} }},
    "sorghum": { "scientific_name": "sorghum_bicolor", "traits": { "stay-green": {"ensembl_id":"Stg1","symbol":"Stg1"}, "drought resistance": {"ensembl_id":"SbDREB2A","symbol":"DREB2A"} }},
    "millet": { "scientific_name": "eleusine_coracana", "traits": { "drought tolerance": {"ensembl_id":"EcDREB1A","symbol":"DREB1A"}, "nutrient content": {"ensembl_id":"EcNAS2","symbol":"NAS2"} }},
    "barley": { "scientific_name": "hordeum_vulgare", "traits": { "disease resistance": {"ensembl_id":"Mla","symbol":"Mla"}, "malting quality": {"ensembl_id":"HvTLP8","symbol":"TLP"} }},
    "cotton": { "scientific_name": "gossypium_hirsutum", "traits": { "fiber length": {"ensembl_id":"GhLi","symbol":"Li1"}, "drought tolerance": {"ensembl_id":"GhDREB2A","symbol":"DREB2A"} }},
    "sugarcane": { "scientific_name": "saccharum_officinarum", "traits": { "sucrose content": {"ensembl_id":"SoSPS3","symbol":"SPS3"}, "drought tolerance": {"ensembl_id":"SoDREB1A","symbol":"DREB1A"} }},
    "potato": { "scientific_name": "solanum_tuberosum", "traits": { "late blight resistance": {"ensembl_id":"PGSC0003DMG400009332","symbol":"RB"}, "starch quality": {"ensembl_id":"GBSS1","symbol":"GBSS1"} }},
    "tomato": { "scientific_name": "solanum_lycopersicum", "traits": { "shelf life": {"ensembl_id":"Solyc05g012020","symbol":"rin"}, "fruit size": {"ensembl_id":"FW2.2","symbol":"FW2.2"} }},
    "eggplant": { "scientific_name": "solanum_melongena", "traits": { "fruit color": {"ensembl_id":"SmMYB1","symbol":"MYB1"}, "eggplant borer resistance": {"ensembl_id":"SmCBP","symbol":"CBP"} }},
    "okra": { "scientific_name": "abelmoschus_esculentus", "traits": { "fibre strength": {"ensembl_id":"AeCesA1","symbol":"CesA1"} }},
    "okra_pulses": { "scientific_name": "vasconcellea_puberula", "traits": {} },
    "mustard": { "scientific_name": "brassica_juncea", "traits": { "oil content": {"ensembl_id":"LOC106352424","symbol":"FAD2"}, "cold tolerance": {"ensembl_id":"LOC106353489","symbol":"CBF1"} }},
    "chickpea": { "scientific_name": "cicer_arietinum", "traits": { "drought resistance": {"ensembl_id":"CaDREB2","symbol":"DREB2"}, "fusarium resistance": {"ensembl_id":"CaFus3","symbol":"Fus3"} }},
    "lentil": { "scientific_name": "lens_culinaris", "traits": { "frost tolerance": {"ensembl_id":"LcCOR15","symbol":"COR15"} }},
    "pigeonpea": { "scientific_name": "cajanus_cajan", "traits": { "wilt resistance": {"ensembl_id":"CPCWR1","symbol":"WR1"} }},
    "peanut": { "scientific_name": "arachis_hypogaea", "traits": { "rust resistance": {"ensembl_id":"AhR1","symbol":"R1"} }},
    "soybean": { "scientific_name": "glycine_max", "traits": { "oil quality": {"ensembl_id":"GmFAD2","symbol":"FAD2"} }},
    "banana": { "scientific_name": "musa_acuminata", "traits": { "panama wilt": {"ensembl_id":"MaRGA2","symbol":"RGA2"} }},
    "tea": { "scientific_name": "camellia_sinensis", "traits": { "cold tolerance": {"ensembl_id":"CsCBF","symbol":"CBF"} }},
    "coffee": { "scientific_name": "coffea_canephora", "traits": { "disease resistance": {"ensembl_id":"CcRGA","symbol":"RGA"} }},
    "rubber": { "scientific_name": "hevea_brasiliensis", "traits": { "latex yield": {"ensembl_id":"HbHB1","symbol":"HB1"} }},
    "sugarbeet": { "scientific_name": "beta_vulgaris", "traits": { "sugar content": {"ensembl_id":"BvSPS1","symbol":"SPS1"} }},
    "sunflower": { "scientific_name": "helianthus_annuus", "traits": { "oil quality": {"ensembl_id":"HaFAD2","symbol":"FAD2"} }},
    "sesame": { "scientific_name": "sesamum_indicum", "traits": { "oil quality": {"ensembl_id":"SiFAD2","symbol":"FAD2"} }},
    "papaya": { "scientific_name": "carica_papaya", "traits": { "papaya ring spot": {"ensembl_id":"CpPRSV","symbol":"PRSV"} }},
    "mango": { "scientific_name": "mangifera_indica", "traits": { "anthracnose": {"ensembl_id":"MiRGA","symbol":"RGA"} }},
    "grape": { "scientific_name": "vitis_vinifera", "traits": { "powdery mildew": {"ensembl_id":"VrRGA","symbol":"RGA"} }},
    "apple": { "scientific_name": "malus_domestica", "traits": { "fire blight": {"ensembl_id":"MdRGA","symbol":"RGA"} }},
    "pear": { "scientific_name": "pyrus_communis", "traits": { "scab resistance": {"ensembl_id":"PcRGA","symbol":"RGA"} }},
    "cherry": { "scientific_name": "prunus_avium", "traits": { "fruit firmness": {"ensembl_id":"PaEXPA","symbol":"EXPA"} }},
    "plum": { "scientific_name": "prunus_domestica", "traits": { "stone hardness": {"ensembl_id":"PdTRA1","symbol":"TRA1"} }},
    "peach": { "scientific_name": "prunus_persica", "traits": { "fruit ripening": {"ensembl_id":"PpACO1","symbol":"ACO1"} }},
    "olive": { "scientific_name": "olea_europaea", "traits": { "oil quality": {"ensembl_id":"OeFAD2","symbol":"FAD2"} }},
    "avocado": { "scientific_name": "persea_americana", "traits": { "cold tolerance": {"ensembl_id":"PaCBF","symbol":"CBF"} }},
    "pineapple": { "scientific_name": "ananas_comosus", "traits": { "fruit sugar": {"ensembl_id":"AcSPS","symbol":"SPS"} }},
    "citrus": { "scientific_name": "citrus_sinensis", "traits": { "citrus greening": {"ensembl_id":"CsRGA","symbol":"RGA"} }},
    "watermelon": { "scientific_name": "citrullus_lanatus", "traits": { "disease resistance": {"ensembl_id":"ClRGA","symbol":"RGA"} }},
    "cucumber": { "scientific_name": "cucumis_sativus", "traits": { "powdery mildew": {"ensembl_id":"CsMLO","symbol":"MLO"} }},
    "pumpkin": { "scientific_name": "cucurbita_maxima", "traits": { "fruit size": {"ensembl_id":"CmSUN","symbol":"SUN"} }},
    "brinjal": { "scientific_name": "solanum_melongena", "traits": { "fruit color": {"ensembl_id":"SmMYB1","symbol":"MYB1"} }},
    "bell_pepper": { "scientific_name": "capsicum_annuum", "traits": { "capsaicin content": {"ensembl_id":"CaPun1","symbol":"Pun1"} }},
    "chilli": { "scientific_name": "capsicum_frutescens", "traits": { "heat level": {"ensembl_id":"Let1","symbol":"Let1"} }},
    "carrot": { "scientific_name": "daucus_carota", "traits": { "beta-carotene": {"ensembl_id":"DcPSY1","symbol":"PSY1"} }},
    "turnip": { "scientific_name": "brassica_rapa", "traits": { "glucosinolate": {"ensembl_id":"BrGSL1","symbol":"GSL1"} }},
    "beet": { "scientific_name": "beta_vulgaris", "traits": { "sugar content": {"ensembl_id":"BvSPS1","symbol":"SPS1"} }},
    "spinach": { "scientific_name": "spinacia_oleracea", "traits": { "leaf size": {"ensembl_id":"SoGHD7","symbol":"GHD7"} }},
    "cabbage": { "scientific_name": "brassica_oleracea", "traits": { "head size": {"ensembl_id":"BoWRKY29","symbol":"WRKY29"} }},
    "cauliflower": { "scientific_name": "brassica_oleracea", "traits": { "curd size": {"ensembl_id":"BoCAL","symbol":"CAL"} }},
    "broccoli": { "scientific_name": "brassica_oleracea", "traits": { "flowering time": {"ensembl_id":"BoVRN1","symbol":"VRN1"} }},
    "radish": { "scientific_name": "raphanus_sativus", "traits": { "root thickness": {"ensembl_id":"RsRD29B","symbol":"RD29B"} }},
    "ginger": { "scientific_name": "zingiber_officinale", "traits": { "disease resistance": {"ensembl_id":"ZoRGA","symbol":"RGA"} }},
    "turmeric": { "scientific_name": "curcuma_longa", "traits": { "curcumin content": {"ensembl_id":"ClCURS","symbol":"CURS"} }},
    "pearl_millet": {"scientific_name":"pennisetum_glaucum", "traits":{"heat tolerance":{"ensembl_id":"PgHSP17","symbol":"HSP17"}}},
    "foxtail_millet": {"scientific_name":"setaria_italica", "traits":{"drought tolerance":{"ensembl_id":"SiDREB2A","symbol":"DREB2A"}}},
    "barnyard_millet": {"scientific_name":"echinochloa_crus_galli", "traits":{"weed competitiveness":{"ensembl_id":"EcTIR1","symbol":"TIR"}}},
    "kodo_millet": {"scientific_name":"paspalum_scrobiculatum", "traits":{"nutrient use":{"ensembl_id":"PsNRT1","symbol":"NRT1"}}},
    "little_millet": {"scientific_name":"panicum_sumatrense", "traits":{"disease resistance":{"ensembl_id":"PsRGA","symbol":"RGA"}}},
    "proso_millet": {"scientific_name":"panicum_miliaceum", "traits":{"grain size":{"ensembl_id":"PmGW2","symbol":"GW2"}}},
    "french_bean": {"scientific_name":"phaseolus_vulgaris", "traits":{"virus resistance":{"ensembl_id":"PvRsv1","symbol":"RSV1"}}},
    "field_bean": {"scientific_name":"vicia_faba", "traits":{"rust resistance":{"ensembl_id":"VfRGA1","symbol":"RGA1"}}},
    "cowpea": {"scientific_name":"vigna_unguiculata", "traits":{"aphid resistance":{"ensembl_id":"VuRGA","symbol":"RGA"}}},
    "mung_bean": {"scientific_name":"vigna_radiata", "traits":{"heat tolerance":{"ensembl_id":"VrHSP","symbol":"HSP"}}},
    "horse_gram": {"scientific_name":"macrotyloma_uniflorum", "traits":{"drought tolerance":{"ensembl_id":"MuDREB","symbol":"DREB"}}},
    "ricebean": {"scientific_name":"vigna_umatidala", "traits":{"disease tolerance":{"ensembl_id":"VuRGA2","symbol":"RGA2"}}},
    "nudging_gram": {"scientific_name":"lablab_purpureus", "traits":{"protein quality":{"ensembl_id":"LpGPC","symbol":"GPC"}}},
    "safflower": {"scientific_name":"carthamus_tinctorius", "traits":{"drought resistance":{"ensembl_id":"CtDREB","symbol":"DREB"}}},
    "niger_seed": {"scientific_name":"guizotia_abyssinica", "traits":{"oil quality":{"ensembl_id":"GaFAD2","symbol":"FAD2"}}},
    "castor": {"scientific_name":"ricinus_communis", "traits":{"ricin reduction":{"ensembl_id":"RcRicin","symbol":"RIC"}}},
    "linseed": {"scientific_name":"linum_usitatissimum", "traits":{"omega_3 content":{"ensembl_id":"LuFAD3","symbol":"FAD3"}}},
    "sunflower": {"scientific_name":"helianthus_annuus", "traits":{"disease resistance":{"ensembl_id":"HaRGA2","symbol":"RGA2"}}},
    "rapeseed": {"scientific_name":"brassica_napus", "traits":{"canola quality":{"ensembl_id":"BnFAD2","symbol":"FAD2"}}},
    "sesame": {"scientific_name":"sesamum_indicum", "traits":{"lodging resistance":{"ensembl_id":"SiLGR","symbol":"LGR"}}},
    "linseed": {"scientific_name":"linum_usitatissimum", "traits":{"fibre quality":{"ensembl_id":"LuCESA","symbol":"CESA"}}},
    "hemp": {"scientific_name":"cannabis_sativa", "traits":{"cannabinoid content":{"ensembl_id":"CsTHC","symbol":"THC"}}},
    "jute": {"scientific_name":"corchorus_capsularis", "traits":{"fiber strength":{"ensembl_id":"CcCESA","symbol":"CESA"}}},
    "cotton": {"scientific_name":"gossypium_barbadense", "traits":{"fibre quality":{"ensembl_id":"GbQTL","symbol":"QTL"}}},
    "hemp": {"scientific_name":"cannabis_sativa", "traits":{"disease resistance":{"ensembl_id":"CsRGA2","symbol":"RGA2"}}},
    "hemp_fiber": {"scientific_name":"cannabis_sativa", "traits":{"fiber yield":{"ensembl_id":"CsHB1","symbol":"HB1"}}},
    "ramie": {"scientific_name":"boehmeria_nivea", "traits":{"fiber length":{"ensembl_id":"BnLi","symbol":"Li"}}},
    "flax": {"scientific_name":"linum_usitatissimum", "traits":{"phytochemical":{"ensembl_id":"LuPAL","symbol":"PAL"}}},
    "henna": {"scientific_name":"lawsonia_inermis", "traits":{"dye content":{"ensembl_id":"LiLWN","symbol":"LWN"}}},
    "medicinal_astragalus": {"scientific_name":"astragalus_membranaceus", "traits":{"saponin content":{"ensembl_id":"AmSaponin","symbol":"SAP"}}},
    "ashwagandha": {"scientific_name":"withania_somnifera", "traits":{"withanolide biosynthesis":{"ensembl_id":"WsWNK","symbol":"WNK"}}},
    "turmeric": {"scientific_name":"curcuma_longa", "traits":{"disease resistance":{"ensembl_id":"ClRGA2","symbol":"RGA2"}}},
    "ginger": {"scientific_name":"zingiber_officinale", "traits":{"aroma profile":{"ensembl_id":"ZoTPS","symbol":"TPS"}}},
    "lemongrass": {"scientific_name":"cymbopogon_citratus", "traits":{"citral content":{"ensembl_id":"CcCIT","symbol":"CIT"}}},
    "mint": {"scientific_name":"mentha_spicata", "traits":{"menthol content":{"ensembl_id":"MsMINT","symbol":"MINT"}}},
    "basil": {"scientific_name":"ocimum_basilicum", "traits":{"eugenol content":{"ensembl_id":"ObEUG","symbol":"EUG"}}},
    "coriander": {"scientific_name":"coriandrum_sativum", "traits":{"linalool content":{"ensembl_id":"CsLIN","symbol":"LIN"}}},
    "fenugreek": {"scientific_name":"trigonella_foenum_graecum", "traits":{"diosgenin content":{"ensembl_id":"TfDIO","symbol":"DIO"}}},
    "ajwain": {"scientific_name":"trachyspermum_ammi", "traits":{"thymol content":{"ensembl_id":"TaTHY","symbol":"THY"}}},
    "cumin": {"scientific_name":"cuminum_cyminum", "traits":{"essential oil":{"ensembl_id":"CcEO","symbol":"EO"}}},
    "carom": {"scientific_name":"trachyspermum_ammi", "traits":{"aromatic oil":{"ensembl_id":"TaARO","symbol":"ARO"}}},
    "mustard": {"scientific_name":"brassica_rapa", "traits":{"erucic acid content":{"ensembl_id":"BrEAC","symbol":"EAC"}}},
    "radish": {"scientific_name":"raphanus_sativus", "traits":{"glucosinolate content":{"ensembl_id":"RsGSL","symbol":"GSL"}}},
    "taro": {"scientific_name":"colocasia_esculenta", "traits":{"tuber quality":{"ensembl_id":"CeTQ","symbol":"TQ"}}},
    "yam": {"scientific_name":"dioscorea_rotundata", "traits":{"starch content":{"ensembl_id":"DrSPS","symbol":"SPS"}}},
    "cassava": {"scientific_name":"manihot_esculenta", "traits":{"cyanogenic glucoside":{"ensembl_id":"MeCYP79","symbol":"CYP79"}}},
    "sweet_potato": {"scientific_name":"ipomoea_batatas", "traits":{"beta-carotene":{"ensembl_id":"IbPSY","symbol":"PSY"}}},
    "plantain": {"scientific_name":"musa_balbisiana", "traits":{"disease resistance":{"ensembl_id":"MbRGA","symbol":"RGA"}}},
    "oil_palm": {"scientific_name":"elaeis_guineensis", "traits":{"oil yield":{"ensembl_id":"EgOLE","symbol":"OLE"}}},
    "date_palm": {"scientific_name":"phoenix_dactylifera", "traits":{"drought tolerance":{"ensembl_id":"PdDREB","symbol":"DREB"}}},
    "pomegranate": {"scientific_name":"punica_granatum", "traits":{"antioxidant content":{"ensembl_id":"PgANT","symbol":"ANT"}}},
    "guava": {"scientific_name":"psidium_guajava", "traits":{"vitamin_c":{"ensembl_id":"PgGME","symbol":"GME"}}},
    "jackfruit": {"scientific_name":"artocarpus_heterophyllus", "traits":{"fruit size":{"ensembl_id":"AhSUN","symbol":"SUN"}}},
    "mangosteen": {"scientific_name":"garcinia_mangostana", "traits":{"xanthone content":{"ensembl_id":"GmXAN","symbol":"XAN"}}},
    "durian": {"scientific_name":"durio_zibethinus", "traits":{"aroma profile":{"ensembl_id":"DzTPS","symbol":"TPS"}}},
    "breadfruit": {"scientific_name":"artocarpus_altilis", "traits":{"starch quality":{"ensembl_id":"AaGBSS","symbol":"GBSS"}}},
}

# ===================== 📡 Ensembl Fetch =====================
def fetch_ensembl_gene_sequence(gene_info, species):
    try:
        gene_id = gene_info["ensembl_id"]
        url = f"{ENSEMBL_BASE_URL}/lookup/id/{gene_id}?expand=1"
        res = requests.get(url, headers=ENSEMBL_HEADERS)
        if res.status_code != 200:
            symbol_url = f"{ENSEMBL_BASE_URL}/lookup/symbol/{species}/{gene_info['symbol']}?expand=1"
            res = requests.get(symbol_url, headers=ENSEMBL_HEADERS)
            if res.status_code != 200:
                return None
        data = res.json()
        region = f"{data['seq_region_name']}:{data['start']}-{data['end']}"
        seq_url = f"{ENSEMBL_BASE_URL}/sequence/region/{species}/{region}"
        seq_res = requests.get(seq_url, headers=ENSEMBL_HEADERS)
        return seq_res.json()["seq"] if seq_res.status_code == 200 else None
    except Exception:
        return None

# ===================== 🧬 NCBI Fallback ======================
def fetch_ncbi_gene_sequence(gene_info, organism):
    try:
        term = f"{gene_info['symbol']}[Gene Name] AND {organism}[Organism]"
        search = Entrez.esearch(db="nucleotide", term=term, retmax=1)
        record = Entrez.read(search)
        if record["IdList"]:
            gene_id = record["IdList"][0]
            fetch = Entrez.efetch(db="nucleotide", id=gene_id, rettype="fasta", retmode="text")
            seq_record = SeqIO.read(fetch, "fasta")
            return str(seq_record.seq)
    except Exception:
        return None

# ===================== 🧪 gRNA Designer ======================
def grna_design_basic(dna_seq, pam="NGG", guide_length=20):
    guides = []
    pam_regex = pam.replace("N", "[ATGC]")
    for match in re.finditer(f"(?=([ATGC]{{{guide_length}}}{pam_regex}))", dna_seq.upper()):
        guides.append({
            "sequence": match.group(1)[:guide_length],
            "pam": match.group(1)[guide_length:],
            "start": match.start(),
            "strand": "+",
            "score": round(0.9 - (match.start() % 10) * 0.02, 2)
        })
    return sorted(guides, key=lambda x: x["score"], reverse=True)

# ===================== 🧠 Gemini Summary ======================
def explain_with_gemini(crop, trait, gene_info, sequence_length=None):
    prompt = f"""
    You're a CRISPR assistant for Indian farmers.

    Crop: {crop}
    Trait: {trait}
    Gene: {gene_info['symbol']} ({gene_info['ensembl_id']})
    Length: {sequence_length if sequence_length else 'unknown'} bp

    1. Why this gene matters
    2. How editing it helps
    3. Field examples
    4. What's next

    Make it easy to understand, with emojis.
    """
    try:
        return gemini_model.generate_content(prompt).text
    except Exception as e:
        return f"❌ Gemini failed: {e}"

# ===================== 🔬 Analyze Route ======================
@app.route('/api/analyze', methods=['POST'])
def analyze_gene():
    try:
        data = request.json
        crop = data.get("crop", "").lower()
        trait = data.get("trait", "").lower()

        if crop not in trait_species_db:
            return jsonify({"error": "Crop not supported"}), 400
        if trait not in trait_species_db[crop]["traits"]:
            return jsonify({"error": "Trait not supported for this crop"}), 400

        species = trait_species_db[crop]["scientific_name"]
        gene_info = trait_species_db[crop]["traits"][trait]

        dna_seq = fetch_ensembl_gene_sequence(gene_info, species)
        source = "Ensembl"

        if not dna_seq:
            dna_seq = fetch_ncbi_gene_sequence(gene_info, species.replace("_", " "))
            source = "NCBI"

        if not dna_seq:
            return jsonify({"error": "Failed to retrieve gene sequence from Ensembl or NCBI"}), 500

        grnas = grna_design_basic(dna_seq)[:3]
        explanation = explain_with_gemini(crop, trait, gene_info, len(dna_seq))

        response = {
            "crop": crop,
            "trait": trait,
            "gene": gene_info,
            "source": source,
            "sequence_length": len(dna_seq),
            "top_grnas": grnas,
            "explanation": explanation,
            "custom_analysis": False
        }

        return jsonify(response)

    except Exception as e:
        return jsonify({"error": f"Unexpected error: {str(e)}", "traceback": traceback.format_exc()}), 500

# ===================== 🌿 Crop & Trait Data ======================
@app.route('/api/crops_and_traits', methods=['GET'])
def get_crops_and_traits():
    return jsonify(trait_species_db)

# ===================== 🩺 Health Check ======================
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "ok", "message": "API running"})

# ===================== 🚀 Run Flask =========================
if __name__ == '__main__':
    app.run(debug=True, port=5000)