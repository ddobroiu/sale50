export const DPD_COUNTRIES = [
    { code: 'RO', name: 'România' },
    { code: 'HU', name: 'Ungaria' },
    { code: 'BG', name: 'Bulgaria' },
    { code: 'AT', name: 'Austria' },
    { code: 'DE', name: 'Germania' },
    { code: 'IT', name: 'Italia' },
    { code: 'FR', name: 'Franța' },
    { code: 'ES', name: 'Spania' },
    { code: 'GR', name: 'Grecia' },
    { code: 'BE', name: 'Belgia' },
    { code: 'NL', name: 'Olanda' },
    { code: 'PL', name: 'Polonia' },
    { code: 'CZ', name: 'Cehia' },
    { code: 'SK', name: 'Slovacia' },
    { code: 'DK', name: 'Danemarca' },
    { code: 'SE', name: 'Suedia' },
    { code: 'FI', name: 'Finlanda' },
    { code: 'PT', name: 'Portugalia' },
    { code: 'IE', name: 'Irlanda' },
    { code: 'HR', name: 'Croația' },
    { code: 'SI', name: 'Slovenia' },
    { code: 'EE', name: 'Estonia' },
    { code: 'LV', name: 'Letonia' },
    { code: 'LT', name: 'Lituania' },
    { code: 'LU', name: 'Luxemburg' }
];

export function getEstimatedShippingCost(countryCode: string | null | undefined, items: any[]): number {
    let code = (countryCode || 'RO').toUpperCase().trim();
    if (code === 'ROMANIA') code = 'RO';

    if (code === 'RO') return 19.99;

    // Simplified international shipping for magazin
    const basePrices: Record<string, number> = {
        'HU': 45,
        'BG': 45,
        'DE': 75,
        'IT': 85,
        'FR': 95,
        'ES': 105,
    };

    return basePrices[code] || 120;
}
