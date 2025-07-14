export const formatPrice = (price: number, countryCode: string) => {
    
    // Map country code to currency format
    const currencyMap: { [key: string]: { locale: string; currency: string } } = {
      'VN': { locale: 'vi-VN', currency: 'VND' },
      'US': { locale: 'en-US', currency: 'USD' },
      'JP': { locale: 'ja-JP', currency: 'JPY' },
      'CN': { locale: 'zh-CN', currency: 'CNY' },
      'KR': { locale: 'ko-KR', currency: 'KRW' },
      'TH': { locale: 'th-TH', currency: 'THB' },
      'SG': { locale: 'en-SG', currency: 'SGD' },
      'MY': { locale: 'ms-MY', currency: 'MYR' },
      'ID': { locale: 'id-ID', currency: 'IDR' },
      'PH': { locale: 'en-PH', currency: 'PHP' },
      'IN': { locale: 'en-IN', currency: 'INR' },
      'GB': { locale: 'en-GB', currency: 'GBP' },
      'DE': { locale: 'de-DE', currency: 'EUR' },
      'FR': { locale: 'fr-FR', currency: 'EUR' },
      'IT': { locale: 'it-IT', currency: 'EUR' },
      'ES': { locale: 'es-ES', currency: 'EUR' },
      'CA': { locale: 'en-CA', currency: 'CAD' },
      'AU': { locale: 'en-AU', currency: 'AUD' },
      'NZ': { locale: 'en-NZ', currency: 'NZD' },
      'BR': { locale: 'pt-BR', currency: 'BRL' },
      'MX': { locale: 'es-MX', currency: 'MXN' },
      'AR': { locale: 'es-AR', currency: 'ARS' },
      'CL': { locale: 'es-CL', currency: 'CLP' },
      'CO': { locale: 'es-CO', currency: 'COP' },
      'PE': { locale: 'es-PE', currency: 'PEN' },
      'VE': { locale: 'es-VE', currency: 'VES' },
      'ZA': { locale: 'en-ZA', currency: 'ZAR' },
      'EG': { locale: 'ar-EG', currency: 'EGP' },
      'SA': { locale: 'ar-SA', currency: 'SAR' },
      'AE': { locale: 'ar-AE', currency: 'AED' },
      'TR': { locale: 'tr-TR', currency: 'TRY' },
      'RU': { locale: 'ru-RU', currency: 'RUB' },
      'PL': { locale: 'pl-PL', currency: 'PLN' },
      'CZ': { locale: 'cs-CZ', currency: 'CZK' },
      'SK': { locale: 'sk-SK', currency: 'EUR' },
      'HU': { locale: 'hu-HU', currency: 'HUF' },
      'RO': { locale: 'ro-RO', currency: 'RON' },
      'BG': { locale: 'bg-BG', currency: 'BGN' },
      'HR': { locale: 'hr-HR', currency: 'HRK' },
      'SI': { locale: 'sl-SI', currency: 'EUR' },
      'EE': { locale: 'et-EE', currency: 'EUR' },
      'LV': { locale: 'lv-LV', currency: 'EUR' },
      'LT': { locale: 'lt-LT', currency: 'EUR' },
      'FI': { locale: 'fi-FI', currency: 'EUR' },
      'SE': { locale: 'sv-SE', currency: 'SEK' },
      'NO': { locale: 'nb-NO', currency: 'NOK' },
      'DK': { locale: 'da-DK', currency: 'DKK' },
      'IS': { locale: 'is-IS', currency: 'ISK' },
      'CH': { locale: 'de-CH', currency: 'CHF' },
      'AT': { locale: 'de-AT', currency: 'EUR' },
      'BE': { locale: 'nl-BE', currency: 'EUR' },
      'NL': { locale: 'nl-NL', currency: 'EUR' },
      'LU': { locale: 'fr-LU', currency: 'EUR' },
      'IE': { locale: 'en-IE', currency: 'EUR' },
      'PT': { locale: 'pt-PT', currency: 'EUR' },
      'GR': { locale: 'el-GR', currency: 'EUR' },
      'CY': { locale: 'el-CY', currency: 'EUR' },
      'MT': { locale: 'en-MT', currency: 'EUR' }
    };
    
    const currencyInfo = currencyMap[countryCode?.toUpperCase()];
    
    if (currencyInfo) {
      try {
        return new Intl.NumberFormat(currencyInfo.locale, {
          style: "currency",
          currency: currencyInfo.currency,
        }).format(price);
      } catch (error) {
        console.warn(`Error formatting price for country ${countryCode}:`, error);
        return price.toString();
      }
    }
    
    // Fallback: return price as string if country code not found
    return price.toString();
  }