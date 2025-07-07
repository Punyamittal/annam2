export const scrollToSection = (id: string) => {
  const element = document.getElementById(id);
  if (element) {
    // Add offset to account for fixed navbar
    const offset = 80;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;
    
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
};