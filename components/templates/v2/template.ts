export const v2Template = (data: {
  product_name: string;
  product_code: string;
  price: string;
  price_sale: string;
  price_decimal: string;
  price_sale_decimal: string;
  discount_percentage: string;
  country_name: string;
  country_code: string;
  print_date: string;
  pt_brand: string;
  pt_origin_country: string;
  pt_product_code: string;
  pt_original_price: string;
}) => {
  // Hàm chọn class dựa trên độ dài giá (cho giá khuyến mãi)
  const getPriceClass = (price: string) => {
    if (!price) return 'ft16';
    const length = price.length;
    if (length <= 3) return 'ft16'; // 4.3rem (giảm từ 4.5rem)
    if (length <= 4) return 'ft16-small'; // 3.4rem (giảm từ 3.6rem)
    if (length <= 5) return 'ft16-medium'; // 3.2rem (giảm từ 3.4rem)
    if (length <= 6) return 'ft16-large'; // 3rem (giảm từ 3.2rem)
    if (length <= 7) return 'ft16-xlarge'; // 2.8rem (giảm từ 3rem)
    if (length <= 8) return 'ft16-xxlarge'; // 2.7rem (giảm từ 2.8rem)
    if (length <= 9) return 'ft16-xxxlarge'; // 2.5rem (giảm từ 2.6rem)
    if (length <= 10) return 'ft16-mini'; // 2.4rem (giữ nguyên)
    return 'ft16-tiny'; // 2.2rem - cho trường hợp vượt quá 10
  };

  // Hàm chọn class cho giá gốc (nhỏ hơn 0.6 lần)
  const getOriginalPriceClass = (price: string) => {
    if (!price) return 'ft14-original';
    const length = price.length;
    if (length <= 3) return 'ft14-original'; // 2.0625rem (3.4375 * 0.6)
    if (length <= 4) return 'ft14-original-small'; // 1.65rem (2.75 * 0.6)
    if (length <= 5) return 'ft14-original-medium'; // 1.575rem (2.625 * 0.6)
    if (length <= 6) return 'ft14-original-large'; // 1.5rem (2.5 * 0.6)
    if (length <= 7) return 'ft14-original-xlarge'; // 1.425rem (2.375 * 0.6)
    if (length <= 8) return 'ft14-original-xxlarge'; // 1.35rem (2.25 * 0.6)
    if (length <= 9) return 'ft14-original-xxxlarge'; // 1.275rem (2.125 * 0.6)
    if (length <= 10) return 'ft14-original-mini'; // 1.2rem (2 * 0.6)
    return 'ft14-original-tiny'; // 1.125rem (1.875 * 0.6) - cho trường hợp vượt quá 10
  };

  // Hàm tính toán top position cho giá gốc dựa trên độ dài
  const getOriginalPriceTop = (price: string) => {
    if (!price) return '3.5rem';
    const length = price.length;
    const baseTop = 3.5; // vị trí gốc
    const baseFontSize = 3.4375; // font-size gốc của ft14
    
    let fontSize;
    if (length <= 3) fontSize = 2.0625;
    else if (length <= 4) fontSize = 1.65;
    else if (length <= 5) fontSize = 1.575;
    else if (length <= 6) fontSize = 1.5;
    else if (length <= 7) fontSize = 1.425;
    else if (length <= 8) fontSize = 1.35;
    else if (length <= 9) fontSize = 1.275;
    else if (length <= 10) fontSize = 1.2;
    else fontSize = 1.125;

    // Tính toán sự khác biệt về chiều cao và điều chỉnh top
    const heightDiff = (baseFontSize - fontSize) / 2;
    const adjustedTop = baseTop + heightDiff + 0.5;
    
    return `${adjustedTop}rem`;
  };

  const priceClass = getPriceClass(data.price_sale);
  const originalPriceClass = getOriginalPriceClass(data.price);
  const originalPriceTop = getOriginalPriceTop(data.price);

  return `<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="" xml:lang="">
<head>
<title></title>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Sriracha&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
<style type="text/css">
	/* Reset CSS */
	* { margin: 0; padding: 0; box-sizing: border-box; }
	
	/* Font classes với đơn vị rem */
	.ft10{font-size:2.3125rem;font-family:"Sriracha",cursive;color:#000000;}
	.ft11{font-size:0.875rem;font-family:"Inter",sans-serif;color:#000000;}
	.ft12{font-size:0.6875rem;font-family:"Inter",sans-serif;color:#000000;}
	.ft13{font-size:3.0625rem;font-family:"Sriracha",cursive;color:#ffffff;}
	.ft14{font-size:3.4375rem;font-family:"Sriracha",cursive;color:#000000;}
	.ft14-original{font-size:2.0625rem;font-family:"Sriracha",cursive;color:#000000;}
	.ft14-original-small{font-size:1.65rem;font-family:"Sriracha",cursive;color:#000000;}
	.ft14-original-medium{font-size:1.575rem;font-family:"Sriracha",cursive;color:#000000;}
	.ft14-original-large{font-size:1.5rem;font-family:"Sriracha",cursive;color:#000000;}
	.ft14-original-xlarge{font-size:1.425rem;font-family:"Sriracha",cursive;color:#000000;}
	.ft14-original-xxlarge{font-size:1.35rem;font-family:"Sriracha",cursive;color:#000000;}
	.ft14-original-xxxlarge{font-size:1.275rem;font-family:"Sriracha",cursive;color:#000000;}
	.ft14-original-mini{font-size:1.2rem;font-family:"Sriracha",cursive;color:#000000;}
	.ft14-original-tiny{font-size:1.125rem;font-family:"Sriracha",cursive;color:#000000;}
	.ft15{font-size:1.1875rem;font-family:"Inter",sans-serif;color:#000000;}
	.ft16{font-size:4.3rem;font-family:"Sriracha",cursive;color:#000000;}
	.ft16-small{font-size:3.4rem;font-family:"Sriracha",cursive;color:#000000;}
	.ft16-medium{font-size:3.2rem;font-family:"Sriracha",cursive;color:#000000;}
	.ft16-large{font-size:3rem;font-family:"Sriracha",cursive;color:#000000;}
	.ft16-xlarge{font-size:2.8rem;font-family:"Sriracha",cursive;color:#000000;}
	.ft16-xxlarge{font-size:2.7rem;font-family:"Sriracha",cursive;color:#000000;}
	.ft16-xxxlarge{font-size:2.5rem;font-family:"Sriracha",cursive;color:#000000;}
	.ft16-mini{font-size:2.4rem;font-family:"Sriracha",cursive;color:#000000;}
	.ft16-tiny{font-size:2.2rem;font-family:"Sriracha",cursive;color:#000000;}
	.ft17{font-size:1.5625rem;font-family:"Inter",sans-serif;color:#000000;}
	.ft18{font-size:1rem;font-family:"Inter",sans-serif;color:#000000;}
	.ft19{font-size:0.625rem;font-family:"Inter",sans-serif;color:#000000;}
	.ft110{font-size:1px;font-family:Helvetica;color:#000000;}
	.ft111{font-size:0.625rem;line-height:1.25rem;font-family:"Sriracha",cursive;color:#000000;}
	.ft111-inter{font-size:0.625rem;line-height:1.25rem;font-family:"Inter",sans-serif;color:#000000;}
	
	/* CSS cho phần thập phân (số mũ) */
	.decimal-superscript {
		font-size: 0.4em;
		vertical-align: super;
		line-height: 1;
		font-family: "Sriracha", cursive;
		color: #000000;
		position: relative;
		top: -0.2em;
	}
	.decimal-superscript-small {
		font-size: 0.35em;
		vertical-align: super;
		line-height: 1;
		font-family: "Sriracha", cursive;
		color: #000000;
		position: relative;
		top: -0.2em;
	}
	.decimal-superscript-medium {
		font-size: 0.3em;
		vertical-align: super;
		line-height: 1;
		font-family: "Sriracha", cursive;
		color: #000000;
		position: relative;
		top: -0.2em;
	}
	
	/* Print media queries để đảm bảo in đúng */
	@media print {
		html {
			font-size: 16px !important; /* Cố định font-size gốc cho rem */
		}
		
		body {
			margin: 0 !important;
			padding: 0 !important;
			-webkit-print-color-adjust: exact !important;
			color-adjust: exact !important;
			background: none !important;
		}
		
		#page1-div {
			page-break-inside: avoid !important;
			break-inside: avoid !important;
			width: 55.75rem !important;
			height: 78.875rem !important;
			position: relative !important;
			margin: 0 !important;
			padding: 0 !important;
			overflow: hidden !important;
		}
		
		img {
			width: 100% !important;
			height: 100% !important;
			object-fit: cover !important;
			display: block !important;
		}
		
		/* Đảm bảo tất cả text không bị wrap */
		p {
			white-space: nowrap !important;
			overflow: hidden !important;
			position: absolute !important;
		}
		
		/* Đảm bảo không có page break */
		* {
			page-break-inside: avoid !important;
			break-inside: avoid !important;
		}
	}
	
	/* Screen media queries */
	@media screen {
		html {
			font-size: 16px; /* Cố định font-size gốc cho rem */
		}
		
		#page1-div {
			width: 55.75rem;
			height: 78.875rem;
			position: relative;
			margin: 0 auto;
		}
		
		img {
			width: 100%;
			height: 100%;
			object-fit: cover;
		}
	}
</style>
</head>
<body bgcolor="#A0A0A0" vlink="blue" link="blue">
<div id="page1-div">
<img src="/v2s.png" alt="background image"/>
<p style="position:absolute;top:3rem;left:2.5rem;white-space:normal;text-align:left;max-width:8rem;line-height:0.9;" class="ft10">${data.pt_brand}</p>
<p style="position:absolute;top:0.1rem;left:11.4375rem;white-space:nowrap" class="ft11">${data.product_name}</p>
<p style="position:absolute;top:1.75rem;left:21.25rem;white-space:nowrap" class="ft12">${data.pt_original_price}:</p>
<p style="position:absolute;top:3.5rem;left:11.0625rem;white-space:nowrap" class="ft13">${data.discount_percentage}</p>
<p style="position:absolute;top:${originalPriceTop};left:21.6875rem;white-space:nowrap" class="${originalPriceClass}">${data.price.replace(/(\d+)(\s*[^\d\s]+)$/, '$1')}${data.price_decimal ? `<span class="decimal-superscript">${data.price_decimal}</span>` : ''}${data.price.match(/(\s*[^\d\s]+)$/)?.[1] || ''} &nbsp;</p>
<p style="position:absolute;top:3.5875rem;left:28.75rem;white-space:nowrap" class="${priceClass}">${data.price_sale.replace(/(\d+)(\s*[^\d\s]+)$/, '$1')}${data.price_sale_decimal ? `<span class="decimal-superscript">${data.price_sale_decimal}</span>` : ''}${data.price_sale.match(/(\s*[^\d\s]+)$/)?.[1] || ''} &nbsp;</p>
<p style="position:absolute;top:8.3125rem;left:11.4375rem;white-space:nowrap" class="ft111">${data.pt_origin_country}: ${data.country_code} ${data.country_name}<br/><span class="ft111-inter">${data.pt_product_code}: ${data.product_code}</span></p>
</div>
</body>
</html>`;
}; 