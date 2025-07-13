export const a5Template = (data: {
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
	.ft10{font-size:4.0625rem;font-family:"Sriracha",cursive;color:#ffffff;}
	.ft11{font-size:1.75rem;font-family:"Inter",sans-serif;color:#000000;}
	.ft12{font-size:0.8125rem;font-family:"Sriracha",cursive;color:#000000;}
	.ft13{font-size:0.625rem;font-family:"Inter",sans-serif;color:#000000;}
	.ft14{font-size:1.1875rem;font-family:"Inter",sans-serif;color:#000000;}
	.ft15{font-size:5rem;font-family:"Sriracha",cursive;color:#ffffff;}
	.ft16{font-size:5.5rem;font-family:"Sriracha",cursive;color:#000000;}
	.ft17{font-size:2.6875rem;font-family:"Inter",sans-serif;color:#000000;}
	.ft18{font-size:12.0625rem;font-family:"Sriracha",cursive;color:#000000;}
	.ft19{font-size:3.625rem;font-family:"Inter",sans-serif;color:#000000;}
	.ft110{font-size:1.5625rem;font-family:"Inter",sans-serif;color:#000000;}
	.ft111{font-size:-1px;font-family:Helvetica;color:#000000;}
</style>
</head>
<body bgcolor="#A0A0A0" vlink="blue" link="blue">
<div id="page1-div" style="position:relative;width:55.75rem;height:78.875rem;">
<img width="100%" height="100%" src="/a5.png" alt="background image"/>
<p style="position:absolute;top:0.25rem;left:17.1875rem;white-space:nowrap" class="ft10">${data.pt_brand}</p>
<p style="position:absolute;top:6.9375rem;left:1.8125rem;white-space:nowrap" class="ft11">${data.product_name}</p>
<p style="position:absolute;top:10rem;left:1.625rem;white-space:nowrap" class="ft12">${data.pt_origin_country}: ${data.country_code} ${data.country_name}</p>
<p style="position:absolute;top:12rem;left:1.625rem;white-space:nowrap" class="ft13">${data.pt_product_code}: ${data.product_code}</p>
<p style="position:absolute;top:11.1875rem;left:29.5rem;white-space:nowrap" class="ft14">${data.pt_original_price}:</p>
<p style="position:absolute;top:12.5rem;left:5.1875rem;white-space:nowrap" class="ft15">${data.discount_percentage}</p>
<p style="position:absolute;top:12.5rem;left:31.8125rem;white-space:nowrap" class="ft16">${data.price}</p>
<p style="position:absolute;top:19.0625rem;left:20rem;white-space:nowrap" class="ft18">${data.price_sale}</p>

</div>
</body>
</html>`;
}; 