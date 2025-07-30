export const v3Template = (data: {
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
    if (!price) return 'ft17';
    const length = price.length;
    if (length <= 3) return 'ft17'; // 8.75rem - kích thước gốc
    if (length <= 4) return 'ft17-small'; // 7rem
    if (length <= 5) return 'ft17-medium'; // 6.7rem
    if (length <= 6) return 'ft17-large'; // 6.4rem
    if (length <= 7) return 'ft17-xlarge'; // 4.5rem (giảm từ 5rem)
    if (length <= 8) return 'ft17-xxlarge'; // 4.2rem (giảm từ 4.7rem)
    if (length <= 9) return 'ft17-xxxlarge'; // 3.9rem (giảm từ 4.4rem)
    if (length <= 10) return 'ft17-mini'; // 3.6rem (giảm từ 4.1rem)
    return 'ft17-tiny'; // 3.3rem (giảm từ 3.8rem) - cho trường hợp vượt quá 10
  };

  // Hàm chọn class cho giá gốc (nhỏ hơn 0.6 lần)
  const getOriginalPriceClass = (price: string) => {
    if (!price) return 'ft15-original';
    const length = price.length;
    if (length <= 3) return 'ft15-original'; // 3.5rem
    if (length <= 4) return 'ft15-original-small'; // 2.9rem
    if (length <= 5) return 'ft15-original-medium'; // 2.8rem
    if (length <= 6) return 'ft15-original-large'; // 2.7rem
    if (length <= 7) return 'ft15-original-xlarge'; // 2.6rem
    if (length <= 8) return 'ft15-original-xxlarge'; // 2.5rem
    if (length <= 9) return 'ft15-original-xxxlarge'; // 2.4rem
    if (length <= 10) return 'ft15-original-mini'; // 2.3rem
    return 'ft15-original-tiny'; // 2.2rem - cho trường hợp vượt quá 10
  };

  // Hàm tính toán top position cho giá gốc dựa trên độ dài
  const getOriginalPriceTop = (price: string) => {
    if (!price) return '8.75rem';
    const length = price.length;
    const baseTop = 8.75; // vị trí gốc (giảm từ 9 xuống 8.75)
    const baseFontSize = 4.9375; // font-size gốc của ft15
    
    let fontSize;
	if (length <= 3) fontSize = 4.5;
	else if (length <= 4) fontSize = 3.9;
	else if (length <= 5) fontSize = 3.8;
	else if (length <= 6) fontSize = 3.7;
	else if (length <= 7) fontSize = 3.6;
	else if (length <= 8) fontSize = 3.5;
	else if (length <= 9) fontSize = 3.4;
	else if (length <= 10) fontSize = 3.3;
	else fontSize = 3.2;
	

    // Tính toán sự khác biệt về chiều cao và điều chỉnh top (giảm xuống 0rem)
    const heightDiff = (baseFontSize - fontSize) / 2;
    const adjustedTop = baseTop + heightDiff + 0;
    
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
	.ft10{font-size:3.25rem;font-family:"Sriracha",cursive;color:#ffffff;}
	.ft11{font-size:1.375rem;font-family:"Inter",sans-serif;color:#000000;}
	.ft12{font-size:0.625rem;font-family:"Sriracha",cursive;color:#000000;}
	.ft13{font-size:1rem;font-family:"Inter",sans-serif;color:#000000;}
	.ft14{font-size:4rem;font-family:"Sriracha",cursive;color:#ffffff;}
	.ft15{font-size:4.9375rem;font-family:"Sriracha",cursive;color:#000000;}
	.ft15-original{font-size:3.5rem;font-family:"Sriracha",cursive;color:#000000;}
	.ft15-original-small{font-size:2.9rem;font-family:"Sriracha",cursive;color:#000000;}
	.ft15-original-medium{font-size:2.8rem;font-family:"Sriracha",cursive;color:#000000;}
	.ft15-original-large{font-size:2.7rem;font-family:"Sriracha",cursive;color:#000000;}
	.ft15-original-xlarge{font-size:2.6rem;font-family:"Sriracha",cursive;color:#000000;}
	.ft15-original-xxlarge{font-size:2.5rem;font-family:"Sriracha",cursive;color:#000000;}
	.ft15-original-xxxlarge{font-size:2.4rem;font-family:"Sriracha",cursive;color:#000000;}
	.ft15-original-mini{font-size:2.3rem;font-family:"Sriracha",cursive;color:#000000;}
	.ft15-original-tiny{font-size:2.2rem;font-family:"Sriracha",cursive;color:#000000;}
	.ft16{font-size:1.75rem;font-family:"Inter",sans-serif;color:#000000;}
	.ft17{font-size:8.75rem;font-family:"Sriracha",cursive;color:#000000;font-weight:bold;}
	.ft17-small{font-size:7rem;font-family:"Sriracha",cursive;color:#000000;font-weight:bold;}
	.ft17-medium{font-size:6.7rem;font-family:"Sriracha",cursive;color:#000000;font-weight:bold;}
	.ft17-large{font-size:6.4rem;font-family:"Sriracha",cursive;color:#000000;font-weight:bold;}
	.ft17-xlarge{font-size:4.5rem;font-family:"Sriracha",cursive;color:#000000;font-weight:bold;}
	.ft17-xxlarge{font-size:4.2rem;font-family:"Sriracha",cursive;color:#000000;font-weight:bold;}
	.ft17-xxxlarge{font-size:3.9rem;font-family:"Sriracha",cursive;color:#000000;font-weight:bold;}
	.ft17-mini{font-size:3.6rem;font-family:"Sriracha",cursive;color:#000000;font-weight:bold;}
	.ft17-tiny { font-size: 3.3rem; font-family: "Sriracha", cursive; color: #000000; margin-top: 1.5rem; font-weight:bold; }
	.ft18{font-size:3.125rem;font-family:"Inter",sans-serif;color:#000000;}
	.ft19{font-size:1.9375rem;font-family:"Inter",sans-serif;color:#000000;}
	.ft110{font-size:0.8125rem;font-family:"Inter",sans-serif;color:#000000;}
	.ft111{font-size:1px;font-family:Helvetica;color:#000000;}
	
	/* CSS cho phần thập phân (số mũ) */
	.decimal-superscript {
		font-size: 0.6em;
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
<img src="/v3s.png" alt="background image"/>
<p style="position:absolute;top:-0.8rem;left:50%;transform:translateX(-50%);white-space:nowrap" class="ft10">${data.pt_brand}</p>
<p style="position:absolute;top:4rem;left:50%;transform:translateX(-50%);white-space:nowrap" class="ft11">${data.product_name}</p>
<p style="position:absolute;top:5.9375rem;left:0.5625rem;white-space:nowrap" class="ft12">${data.pt_origin_country}: ${data.country_code} ${data.country_name}</p>
<p style="position:absolute;top:7.3125rem;left:20.1875rem;white-space:nowrap" class="ft13">${data.pt_original_price}:</p>
<p style="position:absolute;top:8.6rem;left:0.8125rem;white-space:nowrap;font-weight:bold" class="ft14">${data.discount_percentage}</p>
<p style="position:absolute;top:${originalPriceTop};left:24rem;white-space:nowrap" class="${originalPriceClass}">${data.price.replace(/(\d+)(\s*[^\d\s]+)$/, '$1')}${data.price_decimal ? `<span class="decimal-superscript">&thinsp;${data.price_decimal}</span>` : ''}</p>
<p style="position:absolute;top:6.8rem;right:2rem;white-space:nowrap" class="${priceClass}">${data.price_sale.replace(/(\d+)(\s*[^\d\s]+)$/, '$1')}&thinsp;<span style="display:inline-block;vertical-align:top;line-height:0.8;margin-top:0.4em;"><span style="display:block;font-size:0.4em;margin:0;">${data.price_sale_decimal || '&nbsp;'}</span><span style="display:block;font-size:0.35em;margin:0;">${data.price_sale.match(/(\s*[^\d\s]+)$/)?.[1] || '&nbsp;'}&nbsp;</span></span></p>
<p style="position:absolute;top:15.1875rem;right:2rem;white-space:nowrap;font-weight:600;font-size:1rem;font-family:'Sriracha',cursive;" class="ft13">${data.unit_price_info}&nbsp;</p>
<p style="position:absolute;top:15.1875rem;left:0.5625rem;white-space:nowrap" class="ft110">${data.pt_product_code}: ${data.product_code}</p>
</div>
</body>
</html>`;
}; 