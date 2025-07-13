export const v2Template = (data: {
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
	.ft10{font-size:2.3125rem;font-family:"Sriracha",cursive;color:#000000;}
	.ft11{font-size:0.875rem;font-family:"Inter",sans-serif;color:#000000;}
	.ft12{font-size:0.6875rem;font-family:"Inter",sans-serif;color:#000000;}
	.ft13{font-size:3.0625rem;font-family:"Sriracha",cursive;color:#ffffff;}
	.ft14{font-size:3.4375rem;font-family:"Sriracha",cursive;color:#000000;}
	.ft15{font-size:1.1875rem;font-family:"Inter",sans-serif;color:#000000;}
	.ft16{font-size:5.5rem;font-family:"Sriracha",cursive;color:#000000;}
	.ft17{font-size:1.5625rem;font-family:"Inter",sans-serif;color:#000000;}
	.ft18{font-size:1rem;font-family:"Inter",sans-serif;color:#000000;}
	.ft19{font-size:0.625rem;font-family:"Inter",sans-serif;color:#000000;}
	.ft110{font-size:-1px;font-family:Helvetica;color:#000000;}
	.ft111{font-size:0.625rem;line-height:1.25rem;font-family:"Sriracha",cursive;color:#000000;}
	.ft111-inter{font-size:0.625rem;line-height:1.25rem;font-family:"Inter",sans-serif;color:#000000;}
</style>
</head>
<body bgcolor="#A0A0A0" vlink="blue" link="blue">
<div id="page1-div" style="position:relative;width:55.75rem;height:78.875rem;">
<img width="100%" height="100%" src="/v2.png" alt="background image"/>
<p style="position:absolute;top:3rem;left:2.5rem;white-space:nowrap" class="ft10">${data.pt_brand}</p>
<p style="position:absolute;top:0rem;left:11.4375rem;white-space:nowrap" class="ft11">${data.product_name}</p>
<p style="position:absolute;top:1.75rem;left:21.25rem;white-space:nowrap" class="ft12">${data.pt_original_price}:</p>
<p style="position:absolute;top:3.5rem;left:11.0625rem;white-space:nowrap" class="ft13">${data.discount_percentage}</p>
<p style="position:absolute;top:3.5rem;left:21.6875rem;white-space:nowrap" class="ft14">${data.price}</p>
<p style="position:absolute;top:3.1875rem;left:31.1875rem;white-space:nowrap" class="ft16">${data.price_sale}</p>
<p style="position:absolute;top:8.3125rem;left:11.4375rem;white-space:nowrap" class="ft111">${data.pt_origin_country}: ${data.country_code} ${data.country_name}<br/><span class="ft111-inter">${data.pt_product_code}: ${data.product_code}</span></p>

</div>
</body>
</html>`;
}; 