export const a4Template = (data: {
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
    if (!price) return 'ft17';
    const length = price.length;
    if (length <= 3) return 'ft17'; // 13.75rem - kích thước gốc
    if (length <= 4) return 'ft17-small'; // 11rem
    if (length <= 5) return 'ft17-medium'; // 10.5rem
    if (length <= 6) return 'ft17-large'; // 10rem
    if (length <= 7) return 'ft17-xlarge'; // 9.5rem
    if (length <= 8) return 'ft17-xxlarge'; // 9rem
    if (length <= 9) return 'ft17-xxxlarge'; // 8.5rem
    if (length <= 10) return 'ft17-mini'; // 8rem
    return 'ft17-tiny'; // 7.5rem - cho trường hợp vượt quá 10
  };

  // Hàm chọn class cho giá gốc (nhỏ hơn 0.6 lần)
  const getOriginalPriceClass = (price: string) => {
    if (!price) return 'ft17-original';
    const length = price.length;
    if (length <= 3) return 'ft17-original'; // 8.25rem (13.75 * 0.6)
    if (length <= 4) return 'ft17-original-small'; // 6.6rem (11 * 0.6)
    if (length <= 5) return 'ft17-original-medium'; // 6.3rem (10.5 * 0.6)
    if (length <= 6) return 'ft17-original-large'; // 6rem (10 * 0.6)
    if (length <= 7) return 'ft17-original-xlarge'; // 5.7rem (9.5 * 0.6)
    if (length <= 8) return 'ft17-original-xxlarge'; // 5.4rem (9 * 0.6)
    if (length <= 9) return 'ft17-original-xxxlarge'; // 5.1rem (8.5 * 0.6)
    if (length <= 10) return 'ft17-original-mini'; // 4.8rem (8 * 0.6)
    return 'ft17-original-tiny'; // 4.5rem (7.5 * 0.6) - cho trường hợp vượt quá 10
  };

  // Hàm tính toán top position cho giá gốc dựa trên độ dài
  const getOriginalPriceTop = (price: string) => {
    if (!price) return '30rem';
    const length = price.length;
    const baseTop = 30; // vị trí gốc
    const baseFontSize = 7.5; // font-size gốc của ft15
    
    let fontSize;
    if (length <= 3) fontSize = 8.25;
    else if (length <= 4) fontSize = 6.6;
    else if (length <= 5) fontSize = 6.3;
    else if (length <= 6) fontSize = 6;
    else if (length <= 7) fontSize = 5.7;
    else if (length <= 8) fontSize = 5.4;
    else if (length <= 9) fontSize = 5.1;
    else if (length <= 10) fontSize = 4.8;
    else fontSize = 4.5;

    // Tính toán sự khác biệt về chiều cao và điều chỉnh top (tăng thêm 1rem)
    const heightDiff = (baseFontSize - fontSize) / 2;
    const adjustedTop = baseTop + heightDiff + 1;
    
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
	.ft10{font-size:5.5rem;font-family:"Sriracha",cursive;color:#ffffff;}
	.ft11{font-size:1.9375rem;font-family:"Inter",sans-serif;color:#000000;}
	.ft12{font-size:1.375rem;font-family:"Sriracha",cursive;color:#000000;}
	.ft12-inter{font-size:1.375rem;font-family:"Inter",sans-serif;color:#000000;}
	.ft13{font-size:1rem;font-family:"Inter",sans-serif;color:#000000;}
	.ft14{font-size:7.1875rem;font-family:"Sriracha",cursive;color:#ffffff;}
	.ft15{font-size:7.5rem;font-family:"Sriracha",cursive;color:#000000;}
	.ft16{font-size:4.0625rem;font-family:"Inter",sans-serif;color:#000000;}
	.ft17{font-size:13.75rem;font-family:"Sriracha",cursive;color:#000000;}
	.ft17-small{font-size:11rem;font-family:"Sriracha",cursive;color:#000000;}
	.ft17-medium{font-size:10.5rem;font-family:"Sriracha",cursive;color:#000000;}
	.ft17-large{font-size:10rem;font-family:"Sriracha",cursive;color:#000000;}
	.ft17-xlarge{font-size:9.5rem;font-family:"Sriracha",cursive;color:#000000;}
	.ft17-xxlarge{font-size:9rem;font-family:"Sriracha",cursive;color:#000000;}
	.ft17-xxxlarge{font-size:8.5rem;font-family:"Sriracha",cursive;color:#000000;}
	.ft17-mini{font-size:8rem;font-family:"Sriracha",cursive;color:#000000;}
	.ft17-tiny{font-size:7.5rem;font-family:"Sriracha",cursive;color:#000000;}
	.ft17-original{font-size:8.25rem;font-family:"Sriracha",cursive;color:#000000;}
	.ft17-original-small{font-size:6.6rem;font-family:"Sriracha",cursive;color:#000000;}
	.ft17-original-medium{font-size:6.3rem;font-family:"Sriracha",cursive;color:#000000;}
	.ft17-original-large{font-size:6rem;font-family:"Sriracha",cursive;color:#000000;}
	.ft17-original-xlarge{font-size:5.7rem;font-family:"Sriracha",cursive;color:#000000;}
	.ft17-original-xxlarge{font-size:5.4rem;font-family:"Sriracha",cursive;color:#000000;}
	.ft17-original-xxxlarge{font-size:5.1rem;font-family:"Sriracha",cursive;color:#000000;}
	.ft17-original-mini{font-size:4.8rem;font-family:"Sriracha",cursive;color:#000000;}
	.ft17-original-tiny{font-size:4.5rem;font-family:"Sriracha",cursive;color:#000000;}
	.ft18{font-size:4.5625rem;font-family:"Inter",sans-serif;color:#000000;}
	.ft19{font-size:3.125rem;font-family:"Inter",sans-serif;color:#000000;}
	.ft110{font-size:1.5625rem;font-family:"Inter",sans-serif;color:#000000;}
	.ft111{font-size:1px;font-family:Helvetica;color:#000000;}
	
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
<img src="/a4s.png" alt="background image"/>
<p style="position:absolute;top:11rem;left:50%;transform:translateX(-50%);white-space:nowrap" class="ft10">${data.pt_brand}</p>
<p style="position:absolute;top:21.8125rem;left:0.5rem;white-space:nowrap" class="ft11">${data.product_name}</p>
<p style="position:absolute;top:25.375rem;left:1.625rem;white-space:nowrap" class="ft12">${data.pt_origin_country}: ${data.country_code} ${data.country_name}</p>
<p style="position:absolute;top:29.25rem;left:1.625rem;white-space:nowrap" class="ft13">${data.pt_product_code} : ${data.product_code}</p>
<p style="position:absolute;top:29rem;left:24.1875rem;white-space:nowrap" class="ft12-inter">${data.pt_original_price} : </p>
<p style="position:absolute;top:30rem;left:2.0625rem;white-space:nowrap" class="ft14">${data.discount_percentage}</p>
<p style="position:absolute;top:${originalPriceTop};left:25.9375rem;white-space:nowrap" class="${originalPriceClass}">${data.price.replace(/(\d+)(\s*[^\d\s]+)$/, '$1')}${data.price_decimal ? `<span class="decimal-superscript">${data.price_decimal}</span>` : ''}${data.price.match(/(\s*[^\d\s]+)$/)?.[1] || ''} &nbsp;</p>
<p style="position:absolute;top:42.25rem;left:6.25rem;white-space:nowrap" class="${priceClass}">${data.price_sale.replace(/(\d+)(\s*[^\d\s]+)$/, '$1')}${data.price_sale_decimal ? `<span class="decimal-superscript">${data.price_sale_decimal}</span>` : ''}${data.price_sale.match(/(\s*[^\d\s]+)$/)?.[1] || ''}&nbsp;</p> 
</div>
</body>
</html>`;
}; 