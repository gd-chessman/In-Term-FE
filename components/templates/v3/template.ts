export const v3Template = (data: {
  product_name: string;
  product_code: string;
  price: string;
  price_sale: string;
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
    if (length <= 3) return 'ft15-original'; // 2.9625rem (4.9375 * 0.6)
    if (length <= 4) return 'ft15-original-small'; // 2.37rem (3.95 * 0.6)
    if (length <= 5) return 'ft15-original-medium'; // 2.265rem (3.775 * 0.6)
    if (length <= 6) return 'ft15-original-large'; // 2.16rem (3.6 * 0.6)
    if (length <= 7) return 'ft15-original-xlarge'; // 2.055rem (3.425 * 0.6)
    if (length <= 8) return 'ft15-original-xxlarge'; // 1.95rem (3.25 * 0.6)
    if (length <= 9) return 'ft15-original-xxxlarge'; // 1.845rem (3.075 * 0.6)
    if (length <= 10) return 'ft15-original-mini'; // 1.74rem (2.9 * 0.6)
    return 'ft15-original-tiny'; // 1.635rem (2.725 * 0.6) - cho trường hợp vượt quá 10
  };

  // Hàm tính toán top position cho giá gốc dựa trên độ dài
  const getOriginalPriceTop = (price: string) => {
    if (!price) return '8.75rem';
    const length = price.length;
    const baseTop = 8.75; // vị trí gốc (giảm từ 9 xuống 8.75)
    const baseFontSize = 4.9375; // font-size gốc của ft15
    
    let fontSize;
    if (length <= 3) fontSize = 2.9625;
    else if (length <= 4) fontSize = 2.37;
    else if (length <= 5) fontSize = 2.265;
    else if (length <= 6) fontSize = 2.16;
    else if (length <= 7) fontSize = 2.055;
    else if (length <= 8) fontSize = 1.95;
    else if (length <= 9) fontSize = 1.845;
    else if (length <= 10) fontSize = 1.74;
    else fontSize = 1.635;

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
	.ft15-original{font-size:2.9625rem;font-family:"Sriracha",cursive;color:#000000;}
	.ft15-original-small{font-size:2.37rem;font-family:"Sriracha",cursive;color:#000000;}
	.ft15-original-medium{font-size:2.265rem;font-family:"Sriracha",cursive;color:#000000;}
	.ft15-original-large{font-size:2.16rem;font-family:"Sriracha",cursive;color:#000000;}
	.ft15-original-xlarge{font-size:2.055rem;font-family:"Sriracha",cursive;color:#000000;}
	.ft15-original-xxlarge{font-size:1.95rem;font-family:"Sriracha",cursive;color:#000000;}
	.ft15-original-xxxlarge{font-size:1.845rem;font-family:"Sriracha",cursive;color:#000000;}
	.ft15-original-mini{font-size:1.74rem;font-family:"Sriracha",cursive;color:#000000;}
	.ft15-original-tiny{font-size:1.635rem;font-family:"Sriracha",cursive;color:#000000;}
	.ft16{font-size:1.75rem;font-family:"Inter",sans-serif;color:#000000;}
	.ft17{font-size:8.75rem;font-family:"Sriracha",cursive;color:#000000;}
	.ft17-small{font-size:7rem;font-family:"Sriracha",cursive;color:#000000;}
	.ft17-medium{font-size:6.7rem;font-family:"Sriracha",cursive;color:#000000;}
	.ft17-large{font-size:6.4rem;font-family:"Sriracha",cursive;color:#000000;}
	.ft17-xlarge{font-size:4.5rem;font-family:"Sriracha",cursive;color:#000000;}
	.ft17-xxlarge{font-size:4.2rem;font-family:"Sriracha",cursive;color:#000000;}
	.ft17-xxxlarge{font-size:3.9rem;font-family:"Sriracha",cursive;color:#000000;}
	.ft17-mini{font-size:3.6rem;font-family:"Sriracha",cursive;color:#000000;}
	.ft17-tiny{font-size:3.3rem;font-family:"Sriracha",cursive;color:#000000;}
	.ft18{font-size:3.125rem;font-family:"Inter",sans-serif;color:#000000;}
	.ft19{font-size:1.9375rem;font-family:"Inter",sans-serif;color:#000000;}
	.ft110{font-size:0.8125rem;font-family:"Inter",sans-serif;color:#000000;}
	.ft111{font-size:1px;font-family:Helvetica;color:#000000;}
	
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
<img src="/v3.png" alt="background image"/>
<p style="position:absolute;top:0rem;left:50%;transform:translateX(-50%);white-space:nowrap" class="ft10">${data.pt_brand}</p>
<p style="position:absolute;top:4rem;left:7rem;white-space:nowrap" class="ft11">${data.product_name}</p>
<p style="position:absolute;top:5.9375rem;left:0.5625rem;white-space:nowrap" class="ft12">${data.pt_origin_country}: ${data.country_code} ${data.country_name}</p>
<p style="position:absolute;top:7.3125rem;left:20.1875rem;white-space:nowrap" class="ft13">${data.pt_original_price}:</p>
<p style="position:absolute;top:9.25rem;left:0.8125rem;white-space:nowrap" class="ft14">${data.discount_percentage}</p>
<p style="position:absolute;top:${originalPriceTop};left:22.1875rem;white-space:nowrap" class="${originalPriceClass}">${data.price}</p>
<p style="position:absolute;top:8.75rem;left:33.5rem;white-space:nowrap" class="${priceClass}">${data.price_sale}</p>
<p style="position:absolute;top:15.1875rem;left:0.5625rem;white-space:nowrap" class="ft110">${data.pt_product_code}: ${data.product_code}</p>
</div>
</body>
</html>`;
}; 