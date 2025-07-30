export const v1Template = (data: {
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
  unit_price_info: string;
}) => {
  // Hàm chọn class dựa trên độ dài giá (cho giá khuyến mãi)
  const getPriceClass = (price: string) => {
    if (!price) return 'ft16';
    const length = price.length;
    if (length <= 3) return 'ft16'; // 5.3rem (giảm từ 5.5rem)
    if (length <= 4) return 'ft16-small'; // 4.2rem (giảm từ 4.4rem)
    if (length <= 5) return 'ft16-medium'; // 4rem (giảm từ 4.2rem)
    if (length <= 6) return 'ft16-large'; // 3.8rem (giảm từ 4rem)
    if (length <= 7) return 'ft16-xlarge'; // 3.6rem (giảm từ 3.8rem)
    if (length <= 8) return 'ft16-xxlarge'; // 3rem (giảm từ 3.2rem)
    if (length <= 9) return 'ft16-xxxlarge'; // 2.8rem (giảm từ 3rem)
    if (length <= 10) return 'ft16-mini'; // 2.6rem (giảm từ 2.8rem)
    return 'ft16-tiny'; // 2.4rem (giảm từ 2.6rem) - cho trường hợp vượt quá 10
  };

  // Hàm chọn class cho giá gốc (nhỏ hơn 0.6 lần)
  const getOriginalPriceClass = (price: string) => {
    if (!price) return 'ft14-original';
    const length = price.length;
    if (length <= 3) return 'ft14-original'; // 3.5rem
    if (length <= 4) return 'ft14-original-small'; // 3rem
    if (length <= 5) return 'ft14-original-medium'; // 2.9rem
    if (length <= 6) return 'ft14-original-large'; // 2.8rem
    if (length <= 7) return 'ft14-original-xlarge'; // 2.7rem
    if (length <= 8) return 'ft14-original-xxlarge'; // 2.2rem
    if (length <= 9) return 'ft14-original-xxxlarge'; // 2.1rem
    if (length <= 10) return 'ft14-original-mini'; // 2rem
    return 'ft14-original-tiny'; // 1.9rem - cho trường hợp vượt quá 10
  };

  // Hàm tính toán top position cho giá gốc dựa trên độ dài
  const getOriginalPriceTop = (price: string) => {
    if (!price) return '3rem';
    const length = price.length;
    const baseTop = 3; // vị trí gốc
    const baseFontSize = 3.8125; // font-size gốc của ft14
    
    let fontSize;
	if (length <= 3) fontSize = 5.0;
	else if (length <= 4) fontSize = 4.8;
	else if (length <= 5) fontSize = 4.7;
	else if (length <= 6) fontSize = 4.6;
	else if (length <= 7) fontSize = 4.3;
	else if (length <= 8) fontSize = 4.0;
	else if (length <= 9) fontSize = 3.8;
	else if (length <= 10) fontSize = 3.4;
	else fontSize = 3.2;
	

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
	.ft10{font-size:3.4375rem;font-family:"Sriracha",cursive;color:#000000;}
	.ft11{font-size:0.875rem;font-family:"Inter",sans-serif;color:#000000;}
	.ft12{font-size:0.8125rem;font-family:"Inter",sans-serif;color:#000000;}
	.ft13{font-size:3.625rem;font-family:"Sriracha",cursive;color:#ffffff;}
	.ft14{font-size:3.8125rem;font-family:"Sriracha",cursive;color:#000000;}
	.ft14-original{font-size:3.5rem;font-family:"Sriracha",cursive;color:#000000;}
	.ft14-original-small{font-size:3rem;font-family:"Sriracha",cursive;color:#000000;}
	.ft14-original-medium{font-size:2.9rem;font-family:"Sriracha",cursive;color:#000000;}
	.ft14-original-large{font-size:2.8rem;font-family:"Sriracha",cursive;color:#000000;}
	.ft14-original-xlarge{font-size:2.7rem;font-family:"Sriracha",cursive;color:#000000;}
	.ft14-original-xxlarge{font-size:2.2rem;font-family:"Sriracha",cursive;color:#000000;}
	.ft14-original-xxxlarge{font-size:2.1rem;font-family:"Sriracha",cursive;color:#000000;}
	.ft14-original-mini{font-size:2rem;font-family:"Sriracha",cursive;color:#000000;}
	.ft14-original-tiny{font-size:1.9rem;font-family:"Sriracha",cursive;color:#000000;}
	.ft15{font-size:2.125rem;font-family:"Inter",sans-serif;color:#000000;}
	.ft16{font-size:5.3rem;font-family:"Sriracha",cursive;color:#000000;font-weight:bold;}
	.ft16-small{font-size:4.2rem;font-family:"Sriracha",cursive;color:#000000;font-weight:bold;}
	.ft16-medium{font-size:4rem;font-family:"Sriracha",cursive;color:#000000;font-weight:bold;}
	.ft16-large{font-size:3.8rem;font-family:"Sriracha",cursive;color:#000000;font-weight:bold;}
	.ft16-xlarge{font-size:3.6rem;font-family:"Sriracha",cursive;color:#000000;font-weight:bold;}
	.ft16-xxlarge{font-size:3rem;font-family:"Sriracha",cursive;color:#000000;font-weight:bold;}
	.ft16-xxxlarge{font-size:2.8rem;font-family:"Sriracha",cursive;color:#000000;font-weight:bold;}
	.ft16-mini{font-size:2.6rem;font-family:"Sriracha",cursive;color:#000000;font-weight:bold;}
	.ft16-tiny{font-size:2.4rem;font-family:"Sriracha",cursive;color:#000000;font-weight:bold;}
	.ft17{font-size:2.3125rem;font-family:"Inter",sans-serif;color:#000000;}
	.ft18{font-size:1.5625rem;font-family:"Inter",sans-serif;color:#000000;}
	.ft19{font-size:0.625rem;font-family:"Inter",sans-serif;color:#000000;}
	.ft110{font-size:1px;font-family:Helvetica;color:#000000;}
	.ft111{font-size:0.625rem;line-height:1.375rem;font-family:"Sriracha",cursive;color:#000000;}
	.ft111-inter{font-size:0.625rem;line-height:1.375rem;font-family:"Inter",sans-serif;color:#000000;}
	
	/* CSS cho phần thập phân (số mũ) */
	.decimal-superscript {
		font-size: 0.55em;
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
	
	/* CSS cho lá cờ quốc gia */
	.country-flag {
		width: 24px !important;
		height: 18px !important;
		object-fit: cover !important;
		display: inline !important;
		margin-top: 4px !important;
		margin-bottom: 0 !important;
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
		
		/* Điều chỉnh kích thước lá cờ khi in */
		.country-flag {
			width: 16px !important;
			height: 12px !important;
			object-fit: cover !important;
			display: inline !important;
			margin-bottom: 2px !important;
		}
		
		/* Đảm bảo tất cả text không bị wrap */
		p {
			white-space: nowrap !important;
			overflow: hidden !important;
			position: absolute !important;
		}
		
		/* Exception cho brand text - cho phép xuống dòng */
		p.brand-text {
			white-space: normal !important;
			overflow: visible !important;
			word-wrap: break-word !important;
			overflow-wrap: break-word !important;
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
<img src="/v1s.png" alt="background image"/>
<p style="position:absolute;top:0.9rem;left:3.4375rem;white-space:normal;text-align:left;max-width:10.5rem;line-height:0.9;" class="ft10 brand-text">${data.pt_brand}</p>
<p style="position:absolute;top:0.4375rem;left:16.75rem;white-space:nowrap" class="ft11">${data.product_name}</p>
<p style="position:absolute;top:1.9375rem;left:30.8125rem;white-space:nowrap" class="ft12">${data.pt_original_price}:</p>
<p style="position:absolute;top:2.4rem;left:17rem;white-space:nowrap;font-weight:bold" class="ft13">${data.discount_percentage}</p>
<p style="position:absolute;top:${originalPriceTop};left:32rem;white-space:nowrap" class="${originalPriceClass}">${data.price.replace(/(\d+)(\s*[^\d\s]+)$/, '$1')}${data.price_decimal ? `<span class="decimal-superscript">&thinsp;${data.price_decimal}</span>` : ''}</p>
<p style="position:absolute;top:3.3375rem;right:2rem;white-space:nowrap;text-align:right;" class="${priceClass}">${data.price_sale.replace(/(\d+)(\s*[^\d\s]+)$/, '$1')}&thinsp;<span style="display:inline-block;vertical-align:top;line-height:0.8;margin-top:0.4em;"><span style="display:block;font-size:0.4em;margin:0;">${data.price_sale_decimal || '&nbsp;'}</span><span style="display:block;font-size:0.35em;margin:0;">${data.price_sale.match(/(\s*[^\d\s]+)$/)?.[1] || '&nbsp;'}&nbsp;</span></span></p>
<p style="position:absolute;top:8.8rem;right:1rem;white-space:nowrap;text-align:right;font-weight:600;font-size:0.875rem;font-family:'Sriracha',cursive;" class="ft11">${data.unit_price_info}&nbsp;</p>
<p style="position:absolute;top:8.1875rem;left:16.75rem;white-space:nowrap" class="ft111">${data.pt_origin_country}: ${data.country_code} ${data.country_name}<br/><span class="ft111-inter">${data.pt_product_code}: ${data.product_code}</span></p>
</div>
</body>
</html>`;
}; 