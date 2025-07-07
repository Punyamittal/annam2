import React from 'react';
import { BBCHStage } from '../data/bbchDatabase';

interface PlantAnimationProps {
  currentStage: { code: string; stage: BBCHStage } | null;
  cropName: string;
  currentDay: number;
  parameters: {
    temperature: number;
    fertilizer: number;
    water: number;
    humidity: number;
    windSpeed: number;
  };
}

const PlantAnimation: React.FC<PlantAnimationProps> = ({ 
  currentStage, 
  cropName, 
  currentDay,
  parameters 
}) => {
  // Get EXACT BBCH stage specifications including ROOT DEPTH
  const getBBCHSpecs = () => {
    if (!currentStage) return { 
      leaves: 0, tillers: 0, height: 0, hasFlowers: false, hasFruits: false,
      hasRoots: false, showCotyledons: false, flowerCount: 0, fruitCount: 0,
      bollsOpen: false, hasTassel: false, hasSilk: false, earSize: 0,
      isGerminating: false, isMature: false, hasSeeds: false, rootDepth: 0,
      rootWidth: 0, lateralRoots: 0, rootDensity: 0, fibrousRoots: 0
    };
    
    const code = currentStage.code; // string, e.g., '08', '1.', etc.
    const bbchCode = parseInt(code); // numeric, e.g., 8, 1
    
    // BBCH-EXACT specifications with PRECISE ROOT DEVELOPMENT
    const specs = {
      leaves: 0,
      tillers: 0,
      height: 0,
      hasFlowers: false,
      hasFruits: false,
      hasRoots: false,
      showCotyledons: false,
      flowerCount: 0,
      fruitCount: 0,
      bollsOpen: false,
      hasTassel: false,
      hasSilk: false,
      earSize: 0,
      isGerminating: false,
      isMature: false,
      hasSeeds: false,
      hasParticles: false,
      // ROOT SPECIFICATIONS - BBCH EXACT
      rootDepth: 0,        // Depth in pixels
      rootWidth: 0,        // Main root width
      lateralRoots: 0,     // Number of lateral roots
      rootDensity: 0,      // Root hair density
      fibrousRoots: 0      // For rice/cereals
    };

    // --- PATCH FOR NEW COTTON BBCH CODES ---
    if (cropName === 'cotton') {
      // Germination stages
      if (code === '00') {
        specs.height = 0;
        specs.isGerminating = true;
        specs.rootDepth = 0;
      } else if (code === '01') {
        specs.height = 2;
        specs.isGerminating = true;
        specs.rootDepth = 0;
      } else if (code === '03') {
        specs.height = 3;
        specs.isGerminating = true;
        specs.rootDepth = 0;
      } else if (code === '05') {
        specs.height = 5;
        specs.hasRoots = true;
        specs.isGerminating = true;
        specs.rootDepth = 8;
        specs.rootWidth = 1;
        specs.lateralRoots = 0;
        specs.rootDensity = 0;
      } else if (code === '06') {
        specs.height = 8;
        specs.hasRoots = true;
        specs.isGerminating = true;
        specs.rootDepth = 15;
        specs.rootWidth = 1.5;
        specs.lateralRoots = 0;
        specs.rootDensity = 3;
      } else if (code === '07') {
        specs.height = 12;
        specs.hasRoots = true;
        specs.showCotyledons = true;
        specs.isGerminating = true;
        specs.rootDepth = 25;
        specs.rootWidth = 2;
        specs.lateralRoots = 2;
        specs.rootDensity = 5;
      } else if (code === '08') {
        // New: Hypocotyl with cotyledons growing towards soil surface
        specs.height = 16;
        specs.hasRoots = true;
        specs.showCotyledons = true;
        specs.isGerminating = true;
        specs.rootDepth = 30;
        specs.rootWidth = 2.2;
        specs.lateralRoots = 3;
        specs.rootDensity = 6;
      } else if (code === '09') {
        specs.height = 20;
        specs.hasRoots = true;
        specs.showCotyledons = true;
        specs.isGerminating = true;
        specs.rootDepth = 35;
        specs.rootWidth = 2.5;
        specs.lateralRoots = 4;
        specs.rootDensity = 8;
      }
      // Leaf development
      else if (code === '10') {
        specs.height = 25;
        specs.hasRoots = true;
        specs.showCotyledons = true;
        specs.leaves = 0;
        specs.rootDepth = 45;
        specs.rootWidth = 3;
        specs.lateralRoots = 6;
        specs.rootDensity = 10;
      } else if (code === '11') {
        specs.height = 35;
        specs.hasRoots = true;
        specs.showCotyledons = true;
        specs.leaves = 1;
        specs.rootDepth = 55;
        specs.rootWidth = 3;
        specs.lateralRoots = 8;
        specs.rootDensity = 12;
      } else if (code === '12') {
        specs.height = 50;
        specs.hasRoots = true;
        specs.showCotyledons = true;
        specs.leaves = 2;
        specs.rootDepth = 65;
        specs.rootWidth = 3.5;
        specs.lateralRoots = 10;
        specs.rootDensity = 15;
      } else if (code === '13') {
        // New: 3rd true leaf unfolded
        specs.height = 65;
        specs.hasRoots = true;
        specs.showCotyledons = true;
        specs.leaves = 3;
        specs.rootDepth = 75;
        specs.rootWidth = 3.5;
        specs.lateralRoots = 12;
        specs.rootDensity = 18;
      } else if (code === '1.') {
        // Continuous leaf development
        specs.height = 70;
        specs.hasRoots = true;
        specs.showCotyledons = true;
        specs.leaves = 4;
        specs.rootDepth = 80;
        specs.rootWidth = 3.7;
        specs.lateralRoots = 13;
        specs.rootDensity = 19;
      } else if (code === '19') {
        specs.height = 80;
        specs.hasRoots = true;
        specs.showCotyledons = true;
        specs.leaves = 9;
        specs.rootDepth = 90;
        specs.rootWidth = 4;
        specs.lateralRoots = 15;
        specs.rootDensity = 20;
      }
      // Side shoot formation
      else if (code === '21') {
        specs.height = 90;
        specs.hasRoots = true;
        specs.leaves = 10;
        specs.rootDepth = 100;
        specs.rootWidth = 4.2;
        specs.lateralRoots = 16;
        specs.rootDensity = 22;
      } else if (code === '22') {
        specs.height = 100;
        specs.hasRoots = true;
        specs.leaves = 11;
        specs.rootDepth = 110;
        specs.rootWidth = 4.4;
        specs.lateralRoots = 17;
        specs.rootDensity = 23;
      } else if (code === '23') {
        specs.height = 110;
        specs.hasRoots = true;
        specs.leaves = 12;
        specs.rootDepth = 120;
        specs.rootWidth = 4.6;
        specs.lateralRoots = 18;
        specs.rootDensity = 24;
      } else if (code === '2.') {
        // Continuous side shoot formation
        specs.height = 115;
        specs.hasRoots = true;
        specs.leaves = 13;
        specs.rootDepth = 125;
        specs.rootWidth = 4.7;
        specs.lateralRoots = 19;
        specs.rootDensity = 25;
      } else if (code === '29') {
        specs.height = 120;
        specs.hasRoots = true;
        specs.leaves = 14;
        specs.rootDepth = 130;
        specs.rootWidth = 4.8;
        specs.lateralRoots = 20;
        specs.rootDensity = 26;
      }
      // Stem elongation
      else if (code === '31') {
        specs.height = 130;
        specs.hasRoots = true;
        specs.leaves = 15;
        specs.rootDepth = 140;
        specs.rootWidth = 5;
        specs.lateralRoots = 21;
        specs.rootDensity = 27;
      } else if (code === '32') {
        specs.height = 140;
        specs.hasRoots = true;
        specs.leaves = 16;
        specs.rootDepth = 150;
        specs.rootWidth = 5.2;
        specs.lateralRoots = 22;
        specs.rootDensity = 28;
      } else if (code === '33') {
        specs.height = 150;
        specs.hasRoots = true;
        specs.leaves = 17;
        specs.rootDepth = 160;
        specs.rootWidth = 5.4;
        specs.lateralRoots = 23;
        specs.rootDensity = 29;
      } else if (code === '3.') {
        // Continuous stem elongation
        specs.height = 155;
        specs.hasRoots = true;
        specs.leaves = 18;
        specs.rootDepth = 165;
        specs.rootWidth = 5.5;
        specs.lateralRoots = 24;
        specs.rootDensity = 30;
      } else if (code === '39') {
        specs.height = 160;
        specs.hasRoots = true;
        specs.leaves = 19;
        specs.rootDepth = 170;
        specs.rootWidth = 5.6;
        specs.lateralRoots = 25;
        specs.rootDensity = 31;
      }
      // Inflorescence emergence (squares)
      else if (code === '51') {
        specs.height = 170;
        specs.hasRoots = true;
        specs.leaves = 20;
        specs.hasFlowers = false;
        specs.rootDepth = 180;
        specs.rootWidth = 5.8;
        specs.lateralRoots = 26;
        specs.rootDensity = 32;
        specs.flowerCount = 1;
      } else if (code === '52') {
        specs.height = 175;
        specs.hasRoots = true;
        specs.leaves = 21;
        specs.hasFlowers = false;
        specs.rootDepth = 185;
        specs.rootWidth = 6;
        specs.lateralRoots = 27;
        specs.rootDensity = 33;
        specs.flowerCount = 2;
      } else if (code === '55') {
        specs.height = 180;
        specs.hasRoots = true;
        specs.leaves = 22;
        specs.hasFlowers = false;
        specs.rootDepth = 190;
        specs.rootWidth = 6.2;
        specs.lateralRoots = 28;
        specs.rootDensity = 34;
        specs.flowerCount = 3;
      } else if (code === '59') {
        specs.height = 185;
        specs.hasRoots = true;
        specs.leaves = 23;
        specs.hasFlowers = false;
        specs.rootDepth = 195;
        specs.rootWidth = 6.4;
        specs.lateralRoots = 29;
        specs.rootDensity = 35;
        specs.flowerCount = 4;
      }
      // Flowering
      else if (code === '60') {
        specs.height = 190;
        specs.hasRoots = true;
        specs.leaves = 24;
        specs.hasFlowers = true;
        specs.rootDepth = 200;
        specs.rootWidth = 6.6;
        specs.lateralRoots = 30;
        specs.rootDensity = 36;
        specs.flowerCount = 5;
      } else if (code === '61') {
        specs.height = 195;
        specs.hasRoots = true;
        specs.leaves = 24;
        specs.hasFlowers = true;
        specs.rootDepth = 205;
        specs.rootWidth = 6.8;
        specs.lateralRoots = 31;
        specs.rootDensity = 37;
        specs.flowerCount = 6;
      } else if (code === '65') {
        specs.height = 200;
        specs.hasRoots = true;
        specs.leaves = 24;
        specs.hasFlowers = true;
        specs.rootDepth = 210;
        specs.rootWidth = 7;
        specs.lateralRoots = 32;
        specs.rootDensity = 38;
        specs.flowerCount = 8;
      } else if (code === '67') {
        specs.height = 205;
        specs.hasRoots = true;
        specs.leaves = 24;
        specs.hasFlowers = true;
        specs.rootDepth = 215;
        specs.rootWidth = 7.2;
        specs.lateralRoots = 33;
        specs.rootDensity = 39;
        specs.flowerCount = 6;
      } else if (code === '69') {
        specs.height = 210;
        specs.hasRoots = true;
        specs.leaves = 24;
        specs.hasFlowers = true;
        specs.rootDepth = 220;
        specs.rootWidth = 7.4;
        specs.lateralRoots = 34;
        specs.rootDensity = 40;
        specs.flowerCount = 0;
      }
      // Fruit development (bolls)
      else if (code === '71') {
        specs.height = 215;
        specs.hasRoots = true;
        specs.leaves = 24;
        specs.hasFruits = true;
        specs.rootDepth = 225;
        specs.rootWidth = 7.6;
        specs.lateralRoots = 35;
        specs.rootDensity = 41;
        specs.fruitCount = 2;
      } else if (code === '72') {
        specs.height = 220;
        specs.hasRoots = true;
        specs.leaves = 24;
        specs.hasFruits = true;
        specs.rootDepth = 230;
        specs.rootWidth = 7.8;
        specs.lateralRoots = 36;
        specs.rootDensity = 42;
        specs.fruitCount = 4;
      } else if (code === '73') {
        specs.height = 225;
        specs.hasRoots = true;
        specs.leaves = 24;
        specs.hasFruits = true;
        specs.rootDepth = 235;
        specs.rootWidth = 8;
        specs.lateralRoots = 37;
        specs.rootDensity = 43;
        specs.fruitCount = 6;
      } else if (code === '74') {
        specs.height = 230;
        specs.hasRoots = true;
        specs.leaves = 24;
        specs.hasFruits = true;
        specs.rootDepth = 240;
        specs.rootWidth = 8.2;
        specs.lateralRoots = 38;
        specs.rootDensity = 44;
        specs.fruitCount = 8;
      } else if (code === '75') {
        specs.height = 235;
        specs.hasRoots = true;
        specs.leaves = 24;
        specs.hasFruits = true;
        specs.rootDepth = 245;
        specs.rootWidth = 8.4;
        specs.lateralRoots = 39;
        specs.rootDensity = 45;
        specs.fruitCount = 10;
      } else if (code === '76') {
        specs.height = 240;
        specs.hasRoots = true;
        specs.leaves = 24;
        specs.hasFruits = true;
        specs.rootDepth = 250;
        specs.rootWidth = 8.6;
        specs.lateralRoots = 40;
        specs.rootDensity = 46;
        specs.fruitCount = 12;
      } else if (code === '77') {
        specs.height = 245;
        specs.hasRoots = true;
        specs.leaves = 24;
        specs.hasFruits = true;
        specs.rootDepth = 255;
        specs.rootWidth = 8.8;
        specs.lateralRoots = 41;
        specs.rootDensity = 47;
        specs.fruitCount = 14;
      } else if (code === '78') {
        specs.height = 250;
        specs.hasRoots = true;
        specs.leaves = 24;
        specs.hasFruits = true;
        specs.rootDepth = 260;
        specs.rootWidth = 9;
        specs.lateralRoots = 42;
        specs.rootDensity = 48;
        specs.fruitCount = 16;
      } else if (code === '79') {
        specs.height = 255;
        specs.hasRoots = true;
        specs.leaves = 24;
        specs.hasFruits = true;
        specs.rootDepth = 265;
        specs.rootWidth = 9.2;
        specs.lateralRoots = 43;
        specs.rootDensity = 49;
        specs.fruitCount = 18;
        specs.bollsOpen = true;
      }
      // Ripening (bolls open)
      else if (code === '80') {
        specs.height = 260;
        specs.hasRoots = true;
        specs.leaves = 24;
        specs.hasFruits = true;
        specs.rootDepth = 270;
        specs.rootWidth = 9.4;
        specs.lateralRoots = 44;
        specs.rootDensity = 50;
        specs.fruitCount = 18;
        specs.bollsOpen = true;
      } else if (code === '81') {
        specs.height = 265;
        specs.hasRoots = true;
        specs.leaves = 24;
        specs.hasFruits = true;
        specs.rootDepth = 275;
        specs.rootWidth = 9.6;
        specs.lateralRoots = 45;
        specs.rootDensity = 51;
        specs.fruitCount = 18;
        specs.bollsOpen = true;
      } else if (code === '82') {
        specs.height = 270;
        specs.hasRoots = true;
        specs.leaves = 24;
        specs.hasFruits = true;
        specs.rootDepth = 280;
        specs.rootWidth = 9.8;
        specs.lateralRoots = 46;
        specs.rootDensity = 52;
        specs.fruitCount = 18;
        specs.bollsOpen = true;
      } else if (code === '83') {
        specs.height = 275;
        specs.hasRoots = true;
        specs.leaves = 24;
        specs.hasFruits = true;
        specs.rootDepth = 285;
        specs.rootWidth = 10;
        specs.lateralRoots = 47;
        specs.rootDensity = 53;
        specs.fruitCount = 18;
        specs.bollsOpen = true;
      } else if (code === '84') {
        specs.height = 280;
        specs.hasRoots = true;
        specs.leaves = 24;
        specs.hasFruits = true;
        specs.rootDepth = 290;
        specs.rootWidth = 10.2;
        specs.lateralRoots = 48;
        specs.rootDensity = 54;
        specs.fruitCount = 18;
        specs.bollsOpen = true;
      } else if (code === '85') {
        specs.height = 285;
        specs.hasRoots = true;
        specs.leaves = 24;
        specs.hasFruits = true;
        specs.rootDepth = 295;
        specs.rootWidth = 10.4;
        specs.lateralRoots = 49;
        specs.rootDensity = 55;
        specs.fruitCount = 18;
        specs.bollsOpen = true;
      } else if (code === '86') {
        specs.height = 290;
        specs.hasRoots = true;
        specs.leaves = 24;
        specs.hasFruits = true;
        specs.rootDepth = 300;
        specs.rootWidth = 10.6;
        specs.lateralRoots = 50;
        specs.rootDensity = 56;
        specs.fruitCount = 18;
        specs.bollsOpen = true;
      } else if (code === '87') {
        specs.height = 295;
        specs.hasRoots = true;
        specs.leaves = 24;
        specs.hasFruits = true;
        specs.rootDepth = 305;
        specs.rootWidth = 10.8;
        specs.lateralRoots = 51;
        specs.rootDensity = 57;
        specs.fruitCount = 18;
        specs.bollsOpen = true;
      } else if (code === '88') {
        specs.height = 300;
        specs.hasRoots = true;
        specs.leaves = 24;
        specs.hasFruits = true;
        specs.rootDepth = 310;
        specs.rootWidth = 11;
        specs.lateralRoots = 52;
        specs.rootDensity = 58;
        specs.fruitCount = 18;
        specs.bollsOpen = true;
      } else if (code === '89') {
        specs.height = 305;
        specs.hasRoots = true;
        specs.leaves = 24;
        specs.hasFruits = true;
        specs.rootDepth = 315;
        specs.rootWidth = 11.2;
        specs.lateralRoots = 53;
        specs.rootDensity = 59;
        specs.fruitCount = 18;
        specs.bollsOpen = true;
      }
      // Senescence
      else if (code === '91') {
        specs.height = 300;
        specs.hasRoots = true;
        specs.leaves = 20;
        specs.hasFruits = true;
        specs.isMature = true;
        specs.hasSeeds = true;
        specs.rootDepth = 310;
        specs.rootWidth = 11;
        specs.lateralRoots = 52;
        specs.rootDensity = 58;
        specs.fruitCount = 18;
        specs.bollsOpen = true;
      } else if (code === '92') {
        specs.height = 295;
        specs.hasRoots = true;
        specs.leaves = 16;
        specs.hasFruits = true;
        specs.isMature = true;
        specs.hasSeeds = true;
        specs.rootDepth = 305;
        specs.rootWidth = 10.8;
        specs.lateralRoots = 51;
        specs.rootDensity = 57;
        specs.fruitCount = 18;
        specs.bollsOpen = true;
      } else if (code === '93') {
        specs.height = 290;
        specs.hasRoots = true;
        specs.leaves = 12;
        specs.hasFruits = true;
        specs.isMature = true;
        specs.hasSeeds = true;
        specs.rootDepth = 300;
        specs.rootWidth = 10.6;
        specs.lateralRoots = 50;
        specs.rootDensity = 56;
        specs.fruitCount = 18;
        specs.bollsOpen = true;
      } else if (code === '94') {
        specs.height = 285;
        specs.hasRoots = true;
        specs.leaves = 8;
        specs.hasFruits = true;
        specs.isMature = true;
        specs.hasSeeds = true;
        specs.rootDepth = 295;
        specs.rootWidth = 10.4;
        specs.lateralRoots = 49;
        specs.rootDensity = 55;
        specs.fruitCount = 18;
        specs.bollsOpen = true;
      } else if (code === '95') {
        specs.height = 280;
        specs.hasRoots = true;
        specs.leaves = 4;
        specs.hasFruits = true;
        specs.isMature = true;
        specs.hasSeeds = true;
        specs.rootDepth = 290;
        specs.rootWidth = 10.2;
        specs.lateralRoots = 48;
        specs.rootDensity = 54;
        specs.fruitCount = 18;
        specs.bollsOpen = true;
      } else if (code === '96') {
        specs.height = 275;
        specs.hasRoots = true;
        specs.leaves = 0;
        specs.hasFruits = true;
        specs.isMature = true;
        specs.hasSeeds = true;
        specs.rootDepth = 285;
        specs.rootWidth = 10;
        specs.lateralRoots = 47;
        specs.rootDensity = 53;
        specs.fruitCount = 18;
        specs.bollsOpen = true;
      } else if (code === '97') {
        specs.height = 270;
        specs.hasRoots = true;
        specs.leaves = 0;
        specs.hasFruits = true;
        specs.isMature = true;
        specs.hasSeeds = true;
        specs.rootDepth = 280;
        specs.rootWidth = 9.8;
        specs.lateralRoots = 46;
        specs.rootDensity = 52;
        specs.fruitCount = 18;
        specs.bollsOpen = true;
      } else if (code === '99') {
        specs.height = 0;
        specs.hasRoots = false;
        specs.leaves = 0;
        specs.hasFruits = false;
        specs.isMature = false;
        specs.hasSeeds = false;
        specs.rootDepth = 0;
        specs.rootWidth = 0;
        specs.lateralRoots = 0;
        specs.rootDensity = 0;
        specs.fruitCount = 0;
        specs.bollsOpen = false;
      }
      // fallback: use previous numeric logic for any other code
      else if (!isNaN(bbchCode)) {
        // fallback to old logic for numeric codes
        // ... (existing numeric code logic here, if needed) ...
      }
      // Ensure all properties are present
      if (typeof specs.fibrousRoots === 'undefined') specs.fibrousRoots = 0;
      return specs;
    }
    // --- END PATCH ---

    // BBCH 00-09: Germination stages - ROOT EMERGENCE
    if (bbchCode === 0) {
      // BBCH 00: Dry seed - NO ROOTS
      specs.height = 0;
      specs.isGerminating = true;
      specs.rootDepth = 0;
    } else if (bbchCode === 1) {
      // BBCH 01: Beginning of seed imbibition - SEED SWELLING
      specs.height = 2;
      specs.isGerminating = true;
      specs.rootDepth = 0;
    } else if (bbchCode === 3) {
      // BBCH 03: Seed imbibition complete - INTERNAL ROOT INITIATION
      specs.height = 3;
      specs.isGerminating = true;
      specs.rootDepth = 0;
    } else if (bbchCode === 5) {
      // BBCH 05: Radicle emerged from seed - FIRST ROOT VISIBLE
      specs.height = 5;
      specs.hasRoots = true;
      specs.isGerminating = true;
      specs.rootDepth = 8;      // First 8px of root
      specs.rootWidth = 1;      // Thin radicle
      specs.lateralRoots = 0;   // No lateral roots yet
      specs.rootDensity = 0;
    } else if (bbchCode === 6) {
      // BBCH 06: Radicle elongated, root hairs visible - ROOT HAIRS DEVELOP
      specs.height = 8;
      specs.hasRoots = true;
      specs.isGerminating = true;
      specs.rootDepth = 15;     // Root elongates
      specs.rootWidth = 1.5;    // Slightly thicker
      specs.lateralRoots = 0;   // Still no laterals
      specs.rootDensity = 3;    // Root hairs appear
    } else if (bbchCode === 7) {
      // BBCH 07: Coleoptile emerged - ROOT SYSTEM ESTABLISHING
      specs.height = 12;
      specs.hasRoots = true;
      specs.showCotyledons = true;
      specs.isGerminating = true;
      specs.rootDepth = 25;     // Deeper penetration
      specs.rootWidth = 2;      // Thicker main root
      specs.lateralRoots = 2;   // First lateral roots
      specs.rootDensity = 5;
    } else if (bbchCode === 9) {
      // BBCH 09: Emergence - ESTABLISHED ROOT SYSTEM
      specs.height = 20;
      specs.hasRoots = true;
      specs.showCotyledons = true;
      specs.isGerminating = true;
      specs.rootDepth = 35;     // Well-established depth
      specs.rootWidth = 2.5;
      specs.lateralRoots = 4;   // Multiple laterals
      specs.rootDensity = 8;
    }
    
    // BBCH 10-19: Leaf development - ROOT EXPANSION
    else if (bbchCode === 10) {
      specs.height = 25;
      specs.hasRoots = true;
      specs.showCotyledons = true;
      specs.leaves = 0;
      specs.rootDepth = 45;     // Deeper for nutrient access
      specs.rootWidth = 3;
      specs.lateralRoots = 6;
      specs.rootDensity = 10;
    } else if (bbchCode === 11) {
      specs.height = 35;
      specs.hasRoots = true;
      specs.showCotyledons = true;
      specs.leaves = 1;
      specs.rootDepth = 55;
      specs.rootWidth = 3;
      specs.lateralRoots = 8;
      specs.rootDensity = 12;
    } else if (bbchCode === 12) {
      specs.height = 50;
      specs.hasRoots = true;
      specs.showCotyledons = true;
      specs.leaves = 2;
      specs.rootDepth = 65;
      specs.rootWidth = 3.5;
      specs.lateralRoots = 10;
      specs.rootDensity = 15;
    } else if (bbchCode === 13) {
      specs.height = 65;
      specs.hasRoots = true;
      specs.showCotyledons = true;
      specs.leaves = 3;
      specs.rootDepth = 75;
      specs.rootWidth = 3.5;
      specs.lateralRoots = 12;
      specs.rootDensity = 18;
    } else if (bbchCode === 14) {
      specs.height = 80;
      specs.hasRoots = true;
      specs.showCotyledons = true;
      specs.leaves = 4;
      specs.rootDepth = 85;
      specs.rootWidth = 4;
      specs.lateralRoots = 14;
      specs.rootDensity = 20;
    } else if (bbchCode === 15) {
      specs.height = 95;
      specs.hasRoots = true;
      specs.showCotyledons = true;
      specs.leaves = 5;
      specs.rootDepth = 95;
      specs.rootWidth = 4;
      specs.lateralRoots = 16;
      specs.rootDensity = 22;
    } else if (bbchCode === 16) {
      specs.height = 110;
      specs.hasRoots = true;
      specs.showCotyledons = true;
      specs.leaves = 6;
      specs.rootDepth = 105;
      specs.rootWidth = 4.5;
      specs.lateralRoots = 18;
      specs.rootDensity = 25;
    } else if (bbchCode === 17) {
      specs.height = 125;
      specs.hasRoots = true;
      specs.showCotyledons = true;
      specs.leaves = 7;
      specs.rootDepth = 115;
      specs.rootWidth = 4.5;
      specs.lateralRoots = 20;
      specs.rootDensity = 28;
    } else if (bbchCode === 18) {
      specs.height = 140;
      specs.hasRoots = true;
      specs.showCotyledons = true;
      specs.leaves = 8;
      specs.rootDepth = 125;
      specs.rootWidth = 5;
      specs.lateralRoots = 22;
      specs.rootDensity = 30;
    } else if (bbchCode === 19) {
      specs.height = 155;
      specs.hasRoots = true;
      specs.showCotyledons = true;
      specs.leaves = 9;
      specs.rootDepth = 135;
      specs.rootWidth = 5;
      specs.lateralRoots = 24;
      specs.rootDensity = 32;
    }
    
    // BBCH 21-29: Tillering - EXTENSIVE ROOT DEVELOPMENT
    else if (bbchCode === 21) {
      specs.height = 170;
      specs.hasRoots = true;
      specs.leaves = 10;
      specs.tillers = 1;
      specs.rootDepth = 150;    // Deeper for tillering support
      specs.rootWidth = 5.5;
      specs.lateralRoots = 28;  // More laterals for tillers
      specs.rootDensity = 35;
      specs.fibrousRoots = 8;   // Fibrous root development
    } else if (bbchCode === 22) {
      specs.height = 185;
      specs.hasRoots = true;
      specs.leaves = 11;
      specs.tillers = 2;
      specs.rootDepth = 165;
      specs.rootWidth = 6;
      specs.lateralRoots = 32;
      specs.rootDensity = 38;
      specs.fibrousRoots = 12;
    } else if (bbchCode === 23) {
      specs.height = 200;
      specs.hasRoots = true;
      specs.leaves = 12;
      specs.tillers = 3;
      specs.rootDepth = 180;
      specs.rootWidth = 6;
      specs.lateralRoots = 36;
      specs.rootDensity = 40;
      specs.fibrousRoots = 16;
    } else if (bbchCode === 24) {
      specs.height = 215;
      specs.hasRoots = true;
      specs.leaves = 13;
      specs.tillers = 4;
      specs.rootDepth = 195;
      specs.rootWidth = 6.5;
      specs.lateralRoots = 40;
      specs.rootDensity = 42;
      specs.fibrousRoots = 20;
    } else if (bbchCode === 25) {
      specs.height = 230;
      specs.hasRoots = true;
      specs.leaves = 14;
      specs.tillers = 5;
      specs.rootDepth = 210;
      specs.rootWidth = 6.5;
      specs.lateralRoots = 44;
      specs.rootDensity = 45;
      specs.fibrousRoots = 24;
    } else if (bbchCode === 26) {
      specs.height = 245;
      specs.hasRoots = true;
      specs.leaves = 15;
      specs.tillers = 6;
      specs.rootDepth = 225;
      specs.rootWidth = 7;
      specs.lateralRoots = 48;
      specs.rootDensity = 48;
      specs.fibrousRoots = 28;
    } else if (bbchCode === 27) {
      specs.height = 260;
      specs.hasRoots = true;
      specs.leaves = 16;
      specs.tillers = 7;
      specs.rootDepth = 240;
      specs.rootWidth = 7;
      specs.lateralRoots = 52;
      specs.rootDensity = 50;
      specs.fibrousRoots = 32;
    } else if (bbchCode === 28) {
      specs.height = 275;
      specs.hasRoots = true;
      specs.leaves = 17;
      specs.tillers = 8;
      specs.rootDepth = 255;
      specs.rootWidth = 7.5;
      specs.lateralRoots = 56;
      specs.rootDensity = 52;
      specs.fibrousRoots = 36;
    } else if (bbchCode === 29) {
      specs.height = 290;
      specs.hasRoots = true;
      specs.leaves = 18;
      specs.tillers = 8;
      specs.rootDepth = 270;    // Maximum tillering root depth
      specs.rootWidth = 8;
      specs.lateralRoots = 60;
      specs.rootDensity = 55;
      specs.fibrousRoots = 40;
    }
    
    // BBCH 30-39: Stem elongation - DEEP ROOT PENETRATION
    else if (bbchCode >= 30 && bbchCode <= 39) {
      specs.height = 290 + (bbchCode - 30) * 40;
      specs.hasRoots = true;
      specs.leaves = 18 + Math.floor((bbchCode - 30) * 0.5);
      specs.tillers = 8;
      // DEEP ROOT DEVELOPMENT for stem elongation
      specs.rootDepth = 270 + (bbchCode - 30) * 25;  // Up to 495px deep
      specs.rootWidth = 8 + (bbchCode - 30) * 0.3;
      specs.lateralRoots = 60 + (bbchCode - 30) * 2;
      specs.rootDensity = 55 + (bbchCode - 30);
      specs.fibrousRoots = 40 + (bbchCode - 30) * 2;
    }
    
    // BBCH 41-49: Booting - MAXIMUM ROOT DEVELOPMENT
    else if (bbchCode >= 41 && bbchCode <= 49) {
      specs.height = 650 + (bbchCode - 41) * 25;
      specs.hasRoots = true;
      specs.leaves = 22 + Math.floor((bbchCode - 41) * 0.3);
      specs.tillers = 8;
      // MAXIMUM ROOT SYSTEM for reproductive support
      specs.rootDepth = 495 + (bbchCode - 41) * 15;  // Up to 615px
      specs.rootWidth = 10.7 + (bbchCode - 41) * 0.2;
      specs.lateralRoots = 78 + (bbchCode - 41);
      specs.rootDensity = 64 + (bbchCode - 41);
      specs.fibrousRoots = 58 + (bbchCode - 41) * 2;
    }
    
    // BBCH 51-59: Heading - STABLE MATURE ROOT SYSTEM
    else if (bbchCode >= 51 && bbchCode <= 59) {
      specs.height = 875 + (bbchCode - 51) * 15;
      specs.hasRoots = true;
      specs.leaves = 25;
      specs.tillers = 8;
      
      // MATURE ROOT SYSTEM - stable depth
      specs.rootDepth = 615;    // Maximum depth reached
      specs.rootWidth = 12;     // Thick mature roots
      specs.lateralRoots = 86;  // Dense lateral network
      specs.rootDensity = 72;   // High root hair density
      specs.fibrousRoots = 74;  // Extensive fibrous system
      
      if (cropName === 'maize') {
        specs.hasTassel = true;
        specs.rootDepth = 650;  // Maize has deeper roots
      }
    }
    
    // BBCH 60-69: Flowering - ROOT SYSTEM SUPPORTS REPRODUCTION
    else if (bbchCode >= 60 && bbchCode <= 69) {
      specs.height = 1010;
      specs.hasRoots = true;
      specs.leaves = 25;
      specs.tillers = 8;
      specs.hasFlowers = true;
      
      // REPRODUCTIVE SUPPORT ROOT SYSTEM
      specs.rootDepth = 615;
      specs.rootWidth = 12;
      specs.lateralRoots = 86;
      specs.rootDensity = 72;
      specs.fibrousRoots = 74;
      
      if (cropName === 'maize') {
        specs.hasTassel = true;
        specs.rootDepth = 650;
        if (bbchCode >= 63) specs.hasSilk = true;
      }
      
      // EXACT flower count based on BBCH stage
      if (bbchCode === 60) specs.flowerCount = 1;
      else if (bbchCode === 61) specs.flowerCount = 2;
      else if (bbchCode === 65) specs.flowerCount = 8;
      else if (bbchCode === 67) specs.flowerCount = 6;
      else if (bbchCode === 69) specs.flowerCount = 0;
      else specs.flowerCount = Math.min(8, bbchCode - 59);
    }
    
    // BBCH 71-79: Fruit development - ROOT SYSTEM SUPPORTS GRAIN FILLING
    else if (bbchCode >= 71 && bbchCode <= 79) {
      specs.height = 1010;
      specs.hasRoots = true;
      specs.leaves = 25;
      specs.tillers = 8;
      specs.hasFlowers = false;
      specs.hasFruits = true;
      
      // GRAIN FILLING ROOT SUPPORT
      specs.rootDepth = 615;
      specs.rootWidth = 12;
      specs.lateralRoots = 86;
      specs.rootDensity = 72;
      specs.fibrousRoots = 74;
      
      if (cropName === 'maize') {
        specs.hasTassel = true;
        specs.rootDepth = 650;
        specs.earSize = Math.min(100, (bbchCode - 71) * 12);
      }
      
      if (bbchCode === 71) specs.fruitCount = 2;
      else specs.fruitCount = Math.min(12, 2 + (bbchCode - 71) * 1.2);
      
      if (cropName === 'cotton' && bbchCode >= 79) {
        specs.bollsOpen = true;
      }
    }
    
    // BBCH 83-89: Ripening - ROOT SYSTEM MAINTAINS PLANT
    else if (bbchCode >= 83 && bbchCode <= 89) {
      specs.height = 1010;
      specs.hasRoots = true;
      specs.leaves = 25;
      specs.tillers = 8;
      specs.hasFruits = true;
      specs.isMature = true;
      
      // MATURE MAINTENANCE ROOT SYSTEM
      specs.rootDepth = 615;
      specs.rootWidth = 12;
      specs.lateralRoots = 86;
      specs.rootDensity = 72;
      specs.fibrousRoots = 74;
      
      if (cropName === 'maize') {
        specs.hasTassel = true;
        specs.rootDepth = 650;
        specs.earSize = 100;
      }
      
      specs.fruitCount = 12;
      
      if (cropName === 'cotton') {
        specs.bollsOpen = true;
        if (bbchCode >= 85) specs.fruitCount = 15;
        if (bbchCode >= 89) specs.fruitCount = 18;
      }
    }
    
    // BBCH 92+: Senescence - ROOT SYSTEM DECLINING
    else if (bbchCode >= 92) {
      specs.height = 1010;
      specs.hasRoots = true;
      specs.leaves = Math.max(8, 25 - (bbchCode - 92) * 3);
      specs.tillers = 8;
      specs.hasFruits = true;
      specs.isMature = true;
      specs.hasSeeds = true;
      
      // DECLINING ROOT SYSTEM
      const decline = Math.min(0.3, (bbchCode - 92) * 0.1);
      specs.rootDepth = Math.floor(615 * (1 - decline));
      specs.rootWidth = Math.floor(12 * (1 - decline));
      specs.lateralRoots = Math.floor(86 * (1 - decline));
      specs.rootDensity = Math.floor(72 * (1 - decline));
      specs.fibrousRoots = Math.floor(74 * (1 - decline));
      
      if (cropName === 'maize') {
        specs.hasTassel = true;
        specs.rootDepth = Math.floor(650 * (1 - decline));
        specs.earSize = 100;
      }
      
      if (cropName === 'cotton') {
        specs.bollsOpen = true;
        specs.fruitCount = 18;
      } else {
        specs.fruitCount = 12;
      }
    }

    return specs;
  };

  const getStressEffect = () => {
    const waterStress = parameters.water < 20 ? 0.7 : 1.0;
    const tempStress = (parameters.temperature < 15 || parameters.temperature > 35) ? 0.8 : 1.0;
    const nutrientStress = parameters.fertilizer < 100 ? 0.8 : 1.0;
    return waterStress * tempStress * nutrientStress;
  };

  const specs = getBBCHSpecs();
  const stressEffect = getStressEffect();
  const adjustedHeight = specs.height * stressEffect;
  const adjustedRootDepth = specs.rootDepth * stressEffect;
  
  // Ground level - fixed reference point
  const groundLevel = 320;

  const getPlantColor = () => {
    if (!currentStage) return '#4ade80';
    
    const healthFactor = stressEffect;
    const baseHue = specs.isMature ? 45 : 120;
    const saturation = Math.min(90, 60 + healthFactor * 30);
    const lightness = Math.min(50, 25 + healthFactor * 25);
    
    return `hsl(${baseHue}, ${saturation}%, ${lightness}%)`;
  };

  const plantColor = getPlantColor();

  // ENHANCED ROOT RENDERING FUNCTION
  const renderRootSystem = () => {
    if (!specs.hasRoots) return null;

    const rootColor = 'rgb(180, 83, 9)'; // Brown color for roots
    const rootHairColor = 'rgb(146, 64, 14)'; // Darker brown for root hairs

    return (
      <div 
        className="absolute left-1/2 transform -translate-x-1/2"
        style={{ top: `${groundLevel + 8}px` }}
      >
        {/* MAIN TAPROOT - BBCH exact depth */}
        <div
          className="bg-amber-700 rounded-b-full transition-all duration-1000 animate-root-grow"
          style={{
            height: `${adjustedRootDepth}px`,
            width: `${specs.rootWidth}px`,
            backgroundColor: rootColor,
            transformOrigin: 'top center'
          }}
        >
          {/* Root tip - specialized for nutrient absorption */}
          <div
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-2 bg-yellow-600 rounded-full"
            style={{
              backgroundColor: 'rgb(202, 138, 4)',
              animation: 'pulse 2s infinite'
            }}
          />
        </div>

        {/* LATERAL ROOTS - BBCH exact count */}
        {Array.from({ length: specs.lateralRoots }).map((_, index) => {
          const depth = (index + 1) * (adjustedRootDepth / specs.lateralRoots);
          const length = Math.max(8, 15 + index * 2 - Math.abs(index - specs.lateralRoots/2) * 1);
          const angle = index % 2 === 0 ? -25 - (index % 4) * 5 : 25 + (index % 4) * 5;
          
          return (
            <div
              key={`lateral-${index}`}
              className="absolute bg-amber-600 rounded-full transition-all duration-1000 animate-root-grow"
              style={{
                height: `${length}px`,
                width: `${Math.max(0.5, specs.rootWidth * 0.3)}px`,
                top: `${depth}px`,
                left: index % 2 === 0 ? `-${8 + (index % 6) * 2}px` : `${specs.rootWidth + 2 + (index % 6) * 2}px`,
                transform: `rotate(${angle}deg)`,
                transformOrigin: 'top center',
                backgroundColor: rootColor,
                animationDelay: `${index * 0.05}s`
              }}
            >
              {/* Secondary lateral roots */}
              {index % 3 === 0 && specs.rootDensity > 20 && (
                <div
                  className="absolute bg-amber-500 rounded-full animate-root-grow"
                  style={{
                    height: `${length * 0.4}px`,
                    width: '0.5px',
                    top: `${length * 0.3}px`,
                    left: index % 2 === 0 ? '-3px' : '3px',
                    transform: `rotate(${index % 2 === 0 ? 15 : -15}deg)`,
                    transformOrigin: 'top center',
                    backgroundColor: rootHairColor
                  }}
                />
              )}
            </div>
          );
        })}

        {/* FIBROUS ROOTS - For cereals and rice */}
        {(cropName === 'cereals' || cropName === 'rice') && specs.fibrousRoots > 0 &&
          Array.from({ length: specs.fibrousRoots }).map((_, index) => {
            const depth = 5 + (index * (adjustedRootDepth * 0.8) / specs.fibrousRoots);
            const length = 6 + Math.random() * 8;
            const angle = -45 + Math.random() * 90;
            
            return (
              <div
                key={`fibrous-${index}`}
                className="absolute bg-amber-500 rounded-full transition-all duration-1000 animate-root-grow"
                style={{
                  height: `${length}px`,
                  width: '0.5px',
                  top: `${depth}px`,
                  left: index % 2 === 0 ? `-${3 + Math.random() * 8}px` : `${specs.rootWidth + 3 + Math.random() * 8}px`,
                  transform: `rotate(${angle}deg)`,
                  transformOrigin: 'top center',
                  backgroundColor: rootHairColor,
                  opacity: 0.8,
                  animationDelay: `${index * 0.02}s`
                }}
              />
            );
          })
        }

        {/* ROOT HAIRS - Microscopic absorption structures */}
        {specs.rootDensity > 0 && Array.from({ length: Math.min(specs.rootDensity, 50) }).map((_, index) => {
          const depth = 10 + (index * (adjustedRootDepth * 0.9) / specs.rootDensity);
          
          return (
            <div
              key={`root-hair-${index}`}
              className="absolute bg-yellow-600 rounded-full opacity-60 transition-all duration-1000 animate-root-grow"
              style={{
                height: '2px',
                width: '0.3px',
                top: `${depth}px`,
                left: index % 2 === 0 ? `-1px` : `${specs.rootWidth + 1}px`,
                backgroundColor: 'rgb(202, 138, 4)',
                animationDelay: `${index * 0.01}s`
              }}
            />
          );
        })}

        {/* ROOT ZONE INDICATOR - Shows active absorption area */}
        {specs.rootDensity > 30 && (
          <div
            className="absolute rounded-full opacity-20 transition-all duration-2000 animate-pulse"
            style={{
              height: `${adjustedRootDepth * 0.3}px`,
              width: `${(specs.lateralRoots * 0.8) + specs.rootWidth}px`,
              top: `${adjustedRootDepth * 0.7}px`,
              left: `${-(specs.lateralRoots * 0.4)}px`,
              backgroundColor: 'rgb(34, 197, 94)',
            }}
          />
        )}
      </div>
    );
  };

  const renderRicePlant = () => (
    <div className="relative w-full h-full">
      {/* Flooded paddy field */}
      <div 
        className="absolute w-full h-12 bg-gradient-to-t from-blue-900 via-blue-800 to-blue-700 rounded-b-lg"
        style={{ top: `${groundLevel}px` }}
      >
        <div className="absolute inset-0 opacity-40">
          {Array.from({ length: 15 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-0.5 bg-blue-300 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 30}%`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
        <div className="absolute bottom-0 w-full h-6 bg-gradient-to-t from-amber-900 to-amber-800" />
      </div>
      
      {/* BBCH 00-05: Seed stage */}
      {specs.isGerminating && parseInt(currentStage?.code || '0') <= 5 && (
        <div 
          className="absolute left-1/2 transform -translate-x-1/2"
          style={{ top: `${groundLevel - Math.max(5, adjustedHeight)}px` }}
        >
          <div className="w-3 h-2 bg-amber-800 rounded-full animate-pulse" />
        </div>
      )}

      {/* UNDERWATER ROOT SYSTEM - Rice specific */}
      {renderRootSystem()}

      {/* BBCH 07+: Cotyledons emerging from water */}
      {specs.showCotyledons && (
        <div 
          className="absolute left-1/2 transform -translate-x-1/2"
          style={{ top: `${groundLevel - Math.max(15, adjustedHeight * 0.1)}px` }}
        >
          <div className="w-4 h-2 bg-yellow-300 rounded-full transform -rotate-12 absolute -left-2" />
          <div className="w-4 h-2 bg-yellow-300 rounded-full transform rotate-12 absolute -right-2" />
        </div>
      )}
      
      {/* BBCH 10+: Main stem and rice leaves */}
      {adjustedHeight > 20 && (
        <div
          className="absolute left-1/2 transform -translate-x-1/2 bg-green-600 rounded-t-full transition-all duration-1000 ease-out"
          style={{
            height: `${adjustedHeight}px`,
            width: '4px',
            backgroundColor: plantColor,
            top: `${groundLevel - adjustedHeight}px`,
          }}
        >
          {/* EXACT number of rice leaves */}
          {Array.from({ length: specs.leaves }).map((_, index) => {
            const leafPosition = (index + 1) * (adjustedHeight / (specs.leaves + 2));
            return (
              <div
                key={index}
                className="absolute animate-leaf-emerge"
                style={{
                  bottom: `${leafPosition}px`,
                  left: index % 2 === 0 ? '-10px' : '4px',
                  animationDelay: `${index * 0.2}s`,
                }}
              >
                <div
                  className="w-10 h-2 rounded-full transform transition-all duration-500"
                  style={{
                    backgroundColor: plantColor,
                    transform: `rotate(${index % 2 === 0 ? -10 : 10}deg)`,
                    clipPath: 'polygon(0% 50%, 5% 0%, 95% 0%, 100% 50%, 95% 100%, 5% 100%)',
                  }}
                />
                <div
                  className="absolute w-1.5 h-3 rounded-full"
                  style={{
                    backgroundColor: plantColor,
                    bottom: '0px',
                    left: index % 2 === 0 ? '8px' : '-6px',
                  }}
                />
              </div>
            );
          })}
          
          {/* EXACT number of tillers */}
          {Array.from({ length: specs.tillers }).map((_, index) => (
            <div
              key={`tiller-${index}`}
              className="absolute transition-all duration-1000 animate-grow"
              style={{
                bottom: '0px',
                left: `${(index % 2 === 0 ? -1 : 1) * (6 + index * 2)}px`,
                height: `${adjustedHeight * 0.9}px`,
                width: '3px',
                backgroundColor: plantColor,
                transform: `rotate(${(index % 2 === 0 ? -3 : 3) + index * 0.3}deg)`,
                transformOrigin: 'bottom center',
              }}
            />
          ))}
          
          {/* BBCH 51-59: Rice panicle emergence */}
          {specs.hasFlowers && (
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 animate-bloom">
              <div className="w-6 h-12 bg-gradient-to-b from-green-400 to-yellow-400 rounded-t-lg">
                {Array.from({ length: specs.flowerCount * 2 }).map((_, index) => (
                  <div
                    key={index}
                    className="absolute w-0.5 h-2 bg-yellow-500 rounded-full"
                    style={{
                      top: `${2 + index * 1}px`,
                      left: `${1 + (index % 3) * 1.5}px`,
                      transform: `rotate(${-5 + (index % 2) * 10}deg)`,
                    }}
                  />
                ))}
              </div>
            </div>
          )}
          
          {/* BBCH 71+: Rice grains */}
          {specs.hasFruits && (
            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 animate-ripen">
              <div className={`w-8 h-14 rounded-t-lg ${specs.isMature ? 'bg-gradient-to-b from-yellow-200 to-amber-400' : 'bg-gradient-to-b from-green-200 to-green-400'}`}>
                {Array.from({ length: specs.fruitCount * 4 }).map((_, index) => (
                  <div
                    key={index}
                    className={`absolute w-0.5 h-1 rounded-full ${specs.isMature ? 'bg-amber-600' : 'bg-green-600'}`}
                    style={{
                      top: `${2 + (index % 8) * 1.2}px`,
                      left: `${1 + (index % 4) * 1.5}px`,
                    }}
                  />
                ))}
                {specs.isMature && (
                  <div className="absolute inset-0 transform rotate-8 origin-top transition-transform duration-1000" />
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderMaizePlant = () => (
    <div className="relative w-full h-full">
      {/* Soil line */}
      <div 
        className="absolute w-full h-12 bg-gradient-to-t from-amber-900 via-amber-800 to-amber-700 rounded-b-lg"
        style={{ top: `${groundLevel}px` }}
      >
        <div className="absolute inset-0 opacity-30">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-amber-900 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>
      </div>

      {/* BBCH 00-05: Seed stage */}
      {specs.isGerminating && parseInt(currentStage?.code || '0') <= 5 && (
        <div 
          className="absolute left-1/2 transform -translate-x-1/2"
          style={{ top: `${groundLevel - Math.max(5, adjustedHeight)}px` }}
        >
          <div className="w-4 h-3 bg-amber-800 rounded-full animate-pulse" />
        </div>
      )}

      {/* DEEP ROOT SYSTEM - Maize specific */}
      {renderRootSystem()}

      {/* BBCH 07+: Cotyledons */}
      {specs.showCotyledons && (
        <div 
          className="absolute left-1/2 transform -translate-x-1/2"
          style={{ top: `${groundLevel - Math.max(20, adjustedHeight * 0.15)}px` }}
        >
          <div className="w-8 h-4 bg-yellow-300 rounded-lg transform -rotate-15 absolute -left-4" />
          <div className="w-8 h-4 bg-yellow-300 rounded-lg transform rotate-15 absolute -right-4" />
        </div>
      )}
      
      {/* BBCH 10+: Main stem and maize leaves */}
      {adjustedHeight > 20 && (
        <div
          className="absolute left-1/2 transform -translate-x-1/2 bg-green-600 rounded-t-lg transition-all duration-1000 ease-out"
          style={{
            height: `${adjustedHeight}px`,
            width: '12px',
            backgroundColor: plantColor,
            top: `${groundLevel - adjustedHeight}px`,
          }}
        >
          {/* EXACT number of large maize leaves */}
          {Array.from({ length: specs.leaves }).map((_, index) => {
            const leafPosition = (index + 1) * (adjustedHeight / (specs.leaves + 1));
            return (
              <div
                key={index}
                className="absolute animate-leaf-emerge"
                style={{
                  bottom: `${leafPosition}px`,
                  left: index % 2 === 0 ? '-25px' : '12px',
                  animationDelay: `${index * 0.2}s`,
                }}
              >
                <div
                  className="w-16 h-6 rounded-lg transform transition-all duration-500 relative"
                  style={{
                    backgroundColor: plantColor,
                    transform: `rotate(${index % 2 === 0 ? -5 : 5}deg)`,
                  }}
                >
                  <div
                    className="absolute w-0.5 h-full bg-green-700 left-1/2 transform -translate-x-1/2"
                    style={{ backgroundColor: `hsl(120, 80%, 25%)` }}
                  />
                  <div
                    className="absolute w-3 h-4 rounded-lg"
                    style={{
                      backgroundColor: plantColor,
                      bottom: '-4px',
                      left: index % 2 === 0 ? '12px' : '-15px',
                    }}
                  />
                </div>
              </div>
            );
          })}
          
          {/* BBCH 51+: Tassel at top */}
          {specs.hasTassel && (
            <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 animate-sway">
              <div className="w-10 h-18 bg-gradient-to-b from-green-400 to-yellow-400 rounded-t-full relative">
                {Array.from({ length: 15 }).map((_, index) => (
                  <div
                    key={index}
                    className="absolute w-0.5 h-4 bg-yellow-600 rounded-full animate-sway"
                    style={{
                      top: `${3 + index * 0.8}px`,
                      left: `${2 + (index % 3) * 2}px`,
                      transform: `rotate(${-10 + (index % 2) * 20}deg)`,
                      animationDelay: `${index * 0.05}s`,
                    }}
                  />
                ))}
                {specs.hasFlowers && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    {Array.from({ length: 12 }).map((_, index) => (
                      <div
                        key={index}
                        className="absolute w-0.5 h-0.5 bg-yellow-300 rounded-full animate-float opacity-60"
                        style={{
                          left: `${-8 + index * 1.5}px`,
                          animationDelay: `${index * 0.1}s`,
                          animationDuration: '2s',
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* BBCH 63+: Silk emergence */}
          {specs.hasSilk && (
            <div className="absolute left-1/2 transform -translate-x-1/2" style={{ bottom: `${adjustedHeight * 0.4}px` }}>
              {Array.from({ length: 25 }).map((_, index) => (
                <div
                  key={index}
                  className="absolute w-0.3 h-6 bg-amber-200 rounded-full animate-sway"
                  style={{
                    left: `${-8 + index * 0.7}px`,
                    transform: `rotate(${-15 + index * 1.5}deg)`,
                    animationDelay: `${index * 0.03}s`,
                  }}
                />
              ))}
            </div>
          )}
          
          {/* BBCH 71+: Corn ears */}
          {specs.hasFruits && Array.from({ length: Math.min(2, Math.ceil(specs.fruitCount / 6)) }).map((_, index) => {
            const earPosition = adjustedHeight * 0.35 + index * 50;
            const earLength = Math.min(20, 8 + specs.earSize / 5);
            
            return (
              <div
                key={index}
                className="absolute animate-grow"
                style={{
                  bottom: `${earPosition}px`,
                  left: index % 2 === 0 ? '-15px' : '12px',
                  animationDelay: `${index * 0.6}s`,
                }}
              >
                <div
                  className={`w-10 rounded-lg relative border-2 border-green-400 ${specs.isMature ? 'bg-yellow-300' : 'bg-green-300'}`}
                  style={{ height: `${earLength}px` }}
                >
                  {Array.from({ length: Math.floor(earLength / 1.5) * 4 }).map((_, kernelIndex) => (
                    <div
                      key={kernelIndex}
                      className={`absolute w-1 h-1 rounded-sm ${specs.isMature ? 'bg-yellow-500' : 'bg-green-500'}`}
                      style={{
                        top: `${1 + Math.floor(kernelIndex / 4) * 1.5}px`,
                        left: `${1.5 + (kernelIndex % 4) * 2}px`,
                      }}
                    />
                  ))}
                  
                  <div className="absolute -inset-1 bg-green-400 rounded-lg opacity-50 -z-10" />
                  
                  {!specs.isMature && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      {Array.from({ length: 6 }).map((_, silkIndex) => (
                        <div
                          key={silkIndex}
                          className="absolute w-0.3 h-4 bg-amber-300 rounded-full animate-sway"
                          style={{
                            left: `${-1.5 + silkIndex * 0.5}px`,
                            transform: `rotate(${-8 + silkIndex * 2.5}deg)`,
                            animationDelay: `${silkIndex * 0.08}s`,
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  const renderCerealPlant = () => (
    <div className="relative w-full h-full">
      {/* Soil line */}
      <div 
        className="absolute w-full h-12 bg-gradient-to-t from-amber-900 via-amber-800 to-amber-700 rounded-b-lg"
        style={{ top: `${groundLevel}px` }}
      >
        <div className="absolute inset-0 opacity-30">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-amber-900 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>
      </div>
      
      {/* BBCH 00-05: Seed stage */}
      {specs.isGerminating && parseInt(currentStage?.code || '0') <= 5 && (
        <div 
          className="absolute left-1/2 transform -translate-x-1/2"
          style={{ top: `${groundLevel - Math.max(5, adjustedHeight)}px` }}
        >
          <div className="w-3 h-2 bg-amber-800 rounded-full animate-pulse" />
        </div>
      )}

      {/* STANDARD ROOT SYSTEM - Cereals */}
      {renderRootSystem()}

      {/* BBCH 07+: Cotyledons */}
      {specs.showCotyledons && (
        <div 
          className="absolute left-1/2 transform -translate-x-1/2"
          style={{ top: `${groundLevel - Math.max(15, adjustedHeight * 0.1)}px` }}
        >
          <div className="w-6 h-3 bg-yellow-300 rounded-full transform -rotate-12 absolute -left-3" />
          <div className="w-6 h-3 bg-yellow-300 rounded-full transform rotate-12 absolute -right-3" />
        </div>
      )}
      
      {/* BBCH 10+: Main stem and leaves */}
      {adjustedHeight > 20 && (
        <div
          className="absolute left-1/2 transform -translate-x-1/2 bg-green-600 rounded-t-full transition-all duration-1000 ease-out"
          style={{
            height: `${adjustedHeight}px`,
            width: '6px',
            backgroundColor: plantColor,
            top: `${groundLevel - adjustedHeight}px`,
          }}
        >
          {/* EXACT number of leaves */}
          {Array.from({ length: specs.leaves }).map((_, index) => {
            const leafPosition = (index + 1) * (adjustedHeight / (specs.leaves + 2));
            return (
              <div
                key={index}
                className="absolute animate-leaf-emerge"
                style={{
                  bottom: `${leafPosition}px`,
                  left: index % 2 === 0 ? '-12px' : '6px',
                  animationDelay: `${index * 0.2}s`,
                }}
              >
                <div
                  className="w-6 h-3 rounded-full transform transition-all duration-500"
                  style={{
                    backgroundColor: plantColor,
                    transform: `rotate(${index % 2 === 0 ? -20 : 20}deg)`,
                  }}
                />
              </div>
            );
          })}
          
          {/* EXACT number of tillers */}
          {Array.from({ length: specs.tillers }).map((_, index) => (
            <div
              key={`tiller-${index}`}
              className="absolute transition-all duration-1000 animate-grow"
              style={{
                bottom: '0px',
                left: `${(index % 2 === 0 ? -1 : 1) * (8 + index * 3)}px`,
                height: `${adjustedHeight * 0.85}px`,
                width: '4px',
                backgroundColor: plantColor,
                transform: `rotate(${(index % 2 === 0 ? -6 : 6) + index * 0.8}deg)`,
                transformOrigin: 'bottom center',
              }}
            />
          ))}
          
          {/* BBCH 61-69: Flowers */}
          {specs.hasFlowers && (
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 animate-bloom">
              <div className="w-5 h-8 bg-yellow-400 rounded-t-full">
                {Array.from({ length: specs.flowerCount }).map((_, index) => (
                  <div
                    key={index}
                    className="absolute w-1.5 h-1.5 bg-pink-400 rounded-full animate-pulse"
                    style={{
                      top: `${2 + index * 1.5}px`,
                      left: `${1 + (index % 2) * 1.5}px`,
                      animationDelay: `${index * 0.3}s`,
                    }}
                  />
                ))}
              </div>
            </div>
          )}
          
          {/* BBCH 71+: Grains */}
          {specs.hasFruits && (
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 animate-ripen">
              <div className={`w-6 h-10 rounded-t-lg ${specs.isMature ? 'bg-gradient-to-b from-yellow-300 to-amber-500' : 'bg-gradient-to-b from-green-300 to-green-500'}`}>
                {Array.from({ length: specs.fruitCount }).map((_, index) => (
                  <div
                    key={index}
                    className={`absolute w-0.5 h-1.5 rounded-full ${specs.isMature ? 'bg-amber-600' : 'bg-green-600'}`}
                    style={{
                      top: `${2 + (index % 3) * 1.5}px`,
                      left: `${1 + (index % 3) * 1.2}px`,
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderCottonPlant = () => {
    const bbchCode = parseInt(currentStage?.code || '0');
    
    return (
      <div className="relative w-full h-full">
        {/* Soil line */}
        <div 
          className="absolute w-full h-12 bg-gradient-to-t from-amber-900 via-amber-800 to-amber-700 rounded-b-lg"
          style={{ top: `${groundLevel}px` }}
        >
          <div className="absolute inset-0 opacity-40">
            {Array.from({ length: 25 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-amber-900 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
              />
            ))}
          </div>
        </div>

        {/* BBCH 00-05: Seed stage */}
        {bbchCode <= 5 && (
          <div 
            className="absolute left-1/2 transform -translate-x-1/2"
            style={{ top: `${groundLevel - Math.max(5, adjustedHeight)}px` }}
          >
            <div className="w-3 h-2 bg-amber-800 rounded-full animate-pulse" />
          </div>
        )}

        {/* TAPROOT SYSTEM - Cotton specific */}
        {renderRootSystem()}

        {/* BBCH 07-09: Sprouting with cotyledons */}
        {bbchCode >= 7 && bbchCode <= 10 && (
          <div 
            className="absolute left-1/2 transform -translate-x-1/2"
            style={{ top: `${groundLevel - adjustedHeight}px` }}
          >
            <div 
              className="w-2 bg-green-400 rounded-t-full transition-all duration-1000"
              style={{ height: `${adjustedHeight}px` }}
            />
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
              <div className="w-5 h-3 bg-green-300 rounded-lg transform -rotate-12 absolute -left-2.5" />
              <div className="w-5 h-3 bg-green-300 rounded-lg transform rotate-12 absolute -right-2.5" />
            </div>
          </div>
        )}

        {/* BBCH 12+: True cotton leaves */}
        {bbchCode >= 12 && (
          <div 
            className="absolute left-1/2 transform -translate-x-1/2"
            style={{ top: `${groundLevel - adjustedHeight}px` }}
          >
            <div 
              className="w-4 bg-green-600 rounded-t-lg transition-all duration-1000"
              style={{ 
                height: `${adjustedHeight}px`,
                backgroundColor: plantColor 
              }}
            />
            
            {/* EXACT number of cotton leaves */}
            {Array.from({ length: specs.leaves }).map((_, index) => {
              let leafPosition;
              if (specs.leaves === 1) {
                leafPosition = adjustedHeight * 0.6; // Place single leaf at 60% of stem height
              } else {
                leafPosition = (index + 1) * (adjustedHeight / (specs.leaves + 1));
              }
              return (
                <div
                  key={index}
                  className="absolute animate-leaf-emerge"
                  style={{
                    bottom: `${leafPosition}px`,
                    left: index % 2 === 0 ? '-15px' : '4px',
                    animationDelay: `${index * 0.3}s`,
                  }}
                >
                  <div 
                    className="w-8 h-6 transform transition-all duration-500"
                    style={{ 
                      backgroundColor: plantColor,
                      transform: `rotate(${index % 2 === 0 ? -12 : 12}deg)`,
                      clipPath: 'polygon(50% 0%, 70% 20%, 85% 35%, 100% 50%, 85% 65%, 70% 80%, 50% 100%, 30% 80%, 15% 65%, 0% 50%, 15% 35%, 30% 20%)',
                    }}
                  />
                </div>
              );
            })}

            {/* BBCH 51-59: Squares */}
            {bbchCode >= 51 && bbchCode < 60 && Array.from({ length: Math.floor((bbchCode - 50) / 2) }).map((_, index) => {
              const squarePosition = 30 + index * (adjustedHeight / 8);
              return (
                <div
                  key={`square-${index}`}
                  className="absolute animate-grow"
                  style={{
                    bottom: `${squarePosition}px`,
                    left: index % 2 === 0 ? '-6px' : '4px',
                    animationDelay: `${index * 0.5}s`,
                  }}
                >
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-sm" />
                </div>
              );
            })}

            {/* BBCH 60-69: Cotton flowers */}
            {specs.hasFlowers && Array.from({ length: specs.flowerCount }).map((_, index) => {
              const flowerPosition = 40 + index * (adjustedHeight / 12);
              return (
                <div
                  key={`flower-${index}`}
                  className="absolute animate-bloom"
                  style={{
                    bottom: `${flowerPosition}px`,
                    left: index % 2 === 0 ? '-8px' : '4px',
                    animationDelay: `${index * 0.6}s`,
                  }}
                >
                  <div className="w-5 h-5 relative">
                    {Array.from({ length: 5 }).map((_, petalIndex) => (
                      <div
                        key={petalIndex}
                        className="absolute w-2 h-2 bg-white rounded-full border border-yellow-200"
                        style={{
                          top: '50%',
                          left: '50%',
                          transform: `translate(-50%, -50%) rotate(${petalIndex * 72}deg) translateY(-4px)`,
                          transformOrigin: 'center',
                        }}
                      />
                    ))}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-yellow-400 rounded-full" />
                  </div>
                </div>
              );
            })}

            {/* BBCH 71+: Cotton bolls */}
            {specs.hasFruits && Array.from({ length: specs.fruitCount }).map((_, index) => {
              const bollPosition = 35 + index * (adjustedHeight / 18);
              
              return (
                <div
                  key={`boll-${index}`}
                  className="absolute animate-grow"
                  style={{
                    bottom: `${bollPosition}px`,
                    left: index % 2 === 0 ? '-12px' : '4px',
                    animationDelay: `${index * 0.4}s`,
                  }}
                >
                  {specs.bollsOpen ? (
                    <div className="w-8 h-8 relative">
                      {Array.from({ length: 4 }).map((_, segmentIndex) => (
                        <div
                          key={segmentIndex}
                          className="absolute w-2 h-3 bg-amber-700 rounded-lg"
                          style={{
                            top: '50%',
                            left: '50%',
                            transform: `translate(-50%, -50%) rotate(${segmentIndex * 90}deg) translateY(-6px)`,
                            transformOrigin: 'center',
                          }}
                        />
                      ))}
                      
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <div className="w-4 h-4 bg-white rounded-full relative">
                          {Array.from({ length: 8 }).map((_, fiberIndex) => (
                            <div
                              key={fiberIndex}
                              className="absolute w-1 h-1 bg-white rounded-full opacity-90 animate-float"
                              style={{
                                top: `${-2 + Math.sin(fiberIndex * 0.8) * 6}px`,
                                left: `${-2 + Math.cos(fiberIndex * 0.8) * 6}px`,
                                animationDelay: `${fiberIndex * 0.1}s`,
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="w-4 h-6 bg-green-600 rounded-lg relative border-2 border-green-700">
                      <div className="absolute inset-0.5 border border-green-800 rounded" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const renderPlant = () => {
    switch (cropName) {
      case 'cotton':
        return renderCottonPlant();
      case 'maize':
        return renderMaizePlant();
      case 'rice':
        return renderRicePlant();
      case 'cereals':
      default:
        return renderCerealPlant();
    }
  };

  return (
    <div className="w-full h-96 bg-gradient-to-b from-sky-200 via-sky-100 to-green-100 rounded-lg overflow-hidden relative">
      {/* Sky background with clouds */}
      <div className="absolute top-4 left-8 w-16 h-8 bg-white rounded-full opacity-70 animate-float" />
      <div className="absolute top-8 right-12 w-12 h-6 bg-white rounded-full opacity-60 animate-float-delayed" />
      <div className="absolute top-12 left-1/3 w-20 h-10 bg-white rounded-full opacity-50 animate-float-slow" />
      
      {/* Sun */}
      <div className="absolute top-6 right-6 w-12 h-12 bg-yellow-400 rounded-full animate-pulse">
        <div className="absolute inset-1 bg-yellow-300 rounded-full" />
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="absolute w-1 h-4 bg-yellow-400 rounded-full"
            style={{
              top: '-8px',
              left: '50%',
              transformOrigin: '50% 32px',
              transform: `translateX(-50%) rotate(${index * 45}deg)`,
            }}
          />
        ))}
      </div>
      
      {/* Weather effects */}
      {/* {parameters.water > 35 && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 20 }).map((_, index) => (
            <div
              key={index}
              className="absolute w-0.5 h-4 bg-blue-400 rounded-full animate-rain"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: '1s',
              }}
            />
          ))}
        </div>
      )} */}
      
      {/* Plant container */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-40 h-full">
        {renderPlant()}
      </div>
      
      {/* BBCH stage indicator with ROOT DEPTH information */}
      <div className="absolute top-4 left-4 bg-white bg-opacity-95 rounded-lg p-3 text-xs border border-gray-200 shadow-lg">
        <div className="font-bold text-gray-800 mb-1">
          {currentStage ? `BBCH ${currentStage.code}` : 'Not Started'}
        </div>
        <div className="text-gray-600 mb-1 text-xs leading-tight">
          {currentStage?.stage.description || 'Select crop to begin'}
        </div>
        <div className="text-blue-600 font-medium">
          Day {currentDay}
        </div>
        {/* EXACT BBCH specifications with ROOT DEPTH */}
        {currentStage && (
          <div className="mt-2 pt-2 border-t border-gray-200 space-y-1">
            <div className="text-green-700 text-xs">
              <span className="font-medium">Leaves:</span> {specs.leaves === 0 && parseInt(currentStage.code) >= 10 ? 'Present but not unfolded' : specs.leaves}
            </div>
            {specs.tillers > 0 && (
              <div className="text-blue-700 text-xs">
                <span className="font-medium">Tillers:</span> {specs.tillers}
              </div>
            )}
            {specs.hasRoots && (
              <div className="text-amber-700 text-xs">
                <span className="font-medium">Root Depth:</span> {Math.round(adjustedRootDepth * 0.5)}cm
              </div>
            )}
            {specs.lateralRoots > 0 && (
              <div className="text-amber-600 text-xs">
                <span className="font-medium">Lateral Roots:</span> {specs.lateralRoots}
              </div>
            )}
            {specs.hasFlowers && (
              <div className="text-pink-700 text-xs">
                <span className="font-medium">Flowers:</span> {specs.flowerCount}
              </div>
            )}
            {specs.hasFruits && (
              <div className="text-orange-700 text-xs">
                <span className="font-medium">Fruits/Bolls:</span> {specs.fruitCount}
              </div>
            )}
            {specs.bollsOpen && (
              <div className="text-white bg-green-600 px-1 rounded text-xs">
                <span className="font-medium">Bolls Open</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Water level animation */}
      {parameters.water > 0 && (
        <div
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-40"
          style={{ height: '40px', pointerEvents: 'none', zIndex: 2 }}
        >
          <div
            className="absolute left-0 w-full bg-blue-400 bg-opacity-60 rounded-b-lg transition-all duration-700"
            style={{
              bottom: 0,
              height: `${Math.min(parameters.water, 100) * 0.35}px`, // max 35px for 100 water
              boxShadow: '0 2px 8px 0 rgba(30,144,255,0.2)',
            }}
          />
        </div>
      )}
    </div>
  );
};

export default PlantAnimation;