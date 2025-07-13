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
  return `<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="" xml:lang="">
<head>
<title></title>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Sriracha&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
<style type="text/css">
	p {margin: 0; padding: 0;}	
	.ft10{font-size:3.25rem;font-family:"Sriracha",cursive;color:#ffffff;}
	.ft11{font-size:1.375rem;font-family:"Inter",sans-serif;color:#000000;}
	.ft12{font-size:0.625rem;font-family:"Sriracha",cursive;color:#000000;}
	.ft13{font-size:1rem;font-family:"Inter",sans-serif;color:#000000;}
	.ft14{font-size:4rem;font-family:"Sriracha",cursive;color:#ffffff;}
	.ft15{font-size:4.9375rem;font-family:"Sriracha",cursive;color:#000000;}
	.ft16{font-size:1.75rem;font-family:"Inter",sans-serif;color:#000000;}
	.ft17{font-size:8.75rem;font-family:"Sriracha",cursive;color:#000000;}
	.ft18{font-size:3.125rem;font-family:"Inter",sans-serif;color:#000000;}
	.ft19{font-size:1.9375rem;font-family:"Inter",sans-serif;color:#000000;}
	.ft110{font-size:0.8125rem;font-family:"Inter",sans-serif;color:#000000;}
	.ft111{font-size:-1px;font-family:Helvetica;color:#000000;}
</style>
</head>
<body bgcolor="#A0A0A0" vlink="blue" link="blue">
<div id="page1-div" style="position:relative;width:55.75rem;height:78.875rem;">
<img width="100%" height="100%" src="/v3.png" alt="background image"/>
<p style="position:absolute;top:0rem;left:18.375rem;white-space:nowrap" class="ft10">${data.pt_brand}</p>
<p style="position:absolute;top:4rem;left:7rem;white-space:nowrap" class="ft11">${data.product_name}</p>
<p style="position:absolute;top:5.9375rem;left:0.5625rem;white-space:nowrap" class="ft12">${data.pt_origin_country}: ${data.country_code} ${data.country_name}</p>
<p style="position:absolute;top:7.3125rem;left:20.1875rem;white-space:nowrap" class="ft13">${data.pt_original_price}:</p>
<p style="position:absolute;top:9.25rem;left:0.8125rem;white-space:nowrap" class="ft14">${data.discount_percentage}</p>
<p style="position:absolute;top:9.25rem;left:22.1875rem;white-space:nowrap" class="ft15">${data.price}</p>
<p style="position:absolute;top:7.875rem;left:39.25rem;white-space:nowrap" class="ft17">${data.price_sale}</p>
<p style="position:absolute;top:15.1875rem;left:0.5625rem;white-space:nowrap" class="ft110">${data.pt_product_code}: ${data.product_code}</p>

</div>
</body>
</html>`;
}; 