export const a5Template = (data: {
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
	  if (!price) return 'ft18';
	  const length = price.length;
	  if (length <= 3) return 'ft18'; // 12.0625rem - kích thước gốc
	  if (length <= 4) return 'ft18-small'; // 9.65rem
	  if (length <= 5) return 'ft18-medium'; // 9.225rem
	  if (length <= 6) return 'ft18-large'; // 8.8rem
	  if (length <= 7) return 'ft18-xlarge'; // 8.375rem
	  if (length <= 8) return 'ft18-xxlarge'; // 7.95rem
	  if (length <= 9) return 'ft18-xxxlarge'; // 7.525rem
	  if (length <= 10) return 'ft18-mini'; // 7.1rem
	  return 'ft18-tiny'; // 6.675rem - cho trường hợp vượt quá 10
	};
  
	// Hàm chọn class cho giá gốc (nhỏ hơn 0.6 lần)
	const getOriginalPriceClass = (price: string) => {
	  if (!price) return 'ft16-original';
	  const length = price.length;
	  if (length <= 3) return 'ft16-original'; // 8.25rem (giữ nguyên)
	  if (length <= 4) return 'ft16-original-small'; // 4.95rem (8.25 * 0.6)
	  if (length <= 5) return 'ft16-original-medium'; // 4.725rem (7.875 * 0.6)
	  if (length <= 6) return 'ft16-original-large'; // 4.5rem (7.5 * 0.6)
	  if (length <= 7) return 'ft16-original-xlarge'; // 4.275rem (7.125 * 0.6)
	  if (length <= 8) return 'ft16-original-xxlarge'; // 4.05rem (6.75 * 0.6)
	  if (length <= 9) return 'ft16-original-xxxlarge'; // 3.825rem (6.375 * 0.6)
	  if (length <= 10) return 'ft16-original-mini'; // 3.6rem (6 * 0.6)
	  return 'ft16-original-tiny'; // 3.375rem (5.625 * 0.6) - cho trường hợp vượt quá 10
	};
  
	// Hàm tính toán top position cho giá gốc dựa trên độ dài
	const getOriginalPriceTop = (price: string) => {
	  if (!price) return '11.5rem';
	  const length = price.length;
	  const baseTop = 11.5; // vị trí gốc (giảm từ 11.75 xuống 11.5)
	  const baseFontSize = 5.5; // font-size gốc của ft16
	  
	  let fontSize;
	  if (length <= 3) fontSize = 8.75;
	  else if (length <= 4) fontSize = 5.45;
	  else if (length <= 5) fontSize = 5.225;
	  else if (length <= 6) fontSize = 5.0;
	  else if (length <= 7) fontSize = 4.775;
	  else if (length <= 8) fontSize = 4.55;
	  else if (length <= 9) fontSize = 4.325;
	  else if (length <= 10) fontSize = 4.1;
	  else fontSize = 3.875;
	  
	  
  
	  // Tính toán sự khác biệt về chiều cao và điều chỉnh top (giảm xuống 0.75rem)
	  const heightDiff = (baseFontSize - fontSize) / 2;
	  const adjustedTop = baseTop + heightDiff + 0.75;
	  
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
	  .ft10{font-size:4.0625rem;font-family:"Sriracha",cursive;color:#ffffff;}
	  .ft11{font-size:1.75rem;font-family:"Inter",sans-serif;color:#000000;}
	  .ft12{font-size:0.8125rem;font-family:"Sriracha",cursive;color:#000000;}
	  .ft13{font-size:0.625rem;font-family:"Inter",sans-serif;color:#000000;}
	  .ft14{font-size:1.1875rem;font-family:"Inter",sans-serif;color:#000000;}
	  .ft15{font-size:5rem;font-family:"Sriracha",cursive;color:#ffffff;}
	  .ft16{font-size:5.5rem;font-family:"Sriracha",cursive;color:#000000;}
	  .ft16-original{font-size:8.25rem;font-family:"Sriracha",cursive;color:#000000;}
	  .ft16-original-small{font-size:4.95rem;font-family:"Sriracha",cursive;color:#000000;}
	  .ft16-original-medium{font-size:4.725rem;font-family:"Sriracha",cursive;color:#000000;}
	  .ft16-original-large{font-size:4.5rem;font-family:"Sriracha",cursive;color:#000000;}
	  .ft16-original-xlarge{font-size:4.275rem;font-family:"Sriracha",cursive;color:#000000;}
	  .ft16-original-xxlarge{font-size:4.05rem;font-family:"Sriracha",cursive;color:#000000;}
	  .ft16-original-xxxlarge{font-size:3.825rem;font-family:"Sriracha",cursive;color:#000000;}
	  .ft16-original-mini{font-size:3.6rem;font-family:"Sriracha",cursive;color:#000000;}
	  .ft16-original-tiny{font-size:3.375rem;font-family:"Sriracha",cursive;color:#000000;}
	  .ft17{font-size:2.6875rem;font-family:"Inter",sans-serif;color:#000000;}
	  .ft18{font-size:12.0625rem;font-family:"Sriracha",cursive;color:#000000;}
	  .ft18-small{font-size:9.65rem;font-family:"Sriracha",cursive;color:#000000;}
	  .ft18-medium{font-size:9.225rem;font-family:"Sriracha",cursive;color:#000000;}
	  .ft18-large{font-size:8.8rem;font-family:"Sriracha",cursive;color:#000000;}
	  .ft18-xlarge{font-size:8.375rem;font-family:"Sriracha",cursive;color:#000000;}
	  .ft18-xxlarge{font-size:7.95rem;font-family:"Sriracha",cursive;color:#000000;}
	  .ft18-xxxlarge{font-size:7.525rem;font-family:"Sriracha",cursive;color:#000000;}
	  .ft18-mini{font-size:7.1rem;font-family:"Sriracha",cursive;color:#000000;}
	  .ft18-tiny{font-size:6.675rem;font-family:"Sriracha",cursive;color:#000000;}
	  .ft19{font-size:3.625rem;font-family:"Inter",sans-serif;color:#000000;}
	  .ft110{font-size:1.5625rem;font-family:"Inter",sans-serif;color:#000000;}
	  .ft111{font-size:1px;font-family:Helvetica;color:#000000;}
	  
	  /* CSS cho phần thập phân (số mũ) */
	  .decimal-superscript {
		  font-size: 0.5em;
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
  <img src="/a5s.png" alt="background image"/>
  <p style="position:absolute;top:0.25rem;left:50%;transform:translateX(-50%);white-space:nowrap" class="ft10">${data.pt_brand}</p>
  <p style="position:absolute;top:6.9375rem;left:1.8125rem;white-space:nowrap" class="ft11">${data.product_name}</p>
  <p style="position:absolute;top:10rem;left:1.625rem;white-space:nowrap" class="ft12">${data.pt_origin_country}: ${data.country_code} ${data.country_name}</p>
  <p style="position:absolute;top:12rem;left:1.625rem;white-space:nowrap" class="ft13">${data.pt_product_code}: ${data.product_code}</p>
  <p style="position:absolute;top:11.1875rem;left:29.5rem;white-space:nowrap" class="ft14">${data.pt_original_price}:</p>
  <p style="position:absolute;top:12.5rem;left:5.1875rem;white-space:nowrap" class="ft15">${data.discount_percentage}</p>
  <p style="position:absolute;top:${originalPriceTop};left:31.25rem;white-space:nowrap" class="${originalPriceClass}">${data.price.replace(/(\d+)(\s*[^\d\s]+)$/, '$1')}${data.price_decimal ? `<span class="decimal-superscript">${data.price_decimal}</span>` : ''}</p>
  <p style="position:absolute;top:18.0625rem;left:50%;transform:translateX(-50%);white-space:nowrap" class="${priceClass}">${data.price_sale.replace(/(\d+)(\s*[^\d\s]+)$/, '$1')}<span style="display:inline-block;vertical-align:top;line-height:0.8;margin-top:0.4em;"><span style="display:block;font-size:0.4em;margin:0;">${data.price_sale_decimal || '&nbsp;'}</span><span style="display:block;font-size:0.35em;margin:0;">${data.price_sale.match(/(\s*[^\d\s]+)$/)?.[1] || '&nbsp;'}</span></span></p>
  <p style="position:absolute;top:29rem;left:50%;transform:translateX(-50%);white-space:nowrap;font-weight:600;font-size:1.25rem;font-family:'Sriracha',cursive;" class="ft12">${data.unit_price_info}</p>
  </div>
  </body>
  </html>`;
  }; 