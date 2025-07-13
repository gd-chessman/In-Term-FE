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
	.ft10{font-size:37px;font-family:"Sriracha",cursive;color:#000000;}
	.ft11{font-size:14px;font-family:"Inter",sans-serif;color:#000000;}
	.ft12{font-size:11px;font-family:"Inter",sans-serif;color:#000000;}
	.ft13{font-size:49px;font-family:"Sriracha",cursive;color:#ffffff;}
	.ft14{font-size:55px;font-family:"Sriracha",cursive;color:#000000;}
	.ft15{font-size:19px;font-family:"Inter",sans-serif;color:#000000;}
	.ft16{font-size:88px;font-family:"Sriracha",cursive;color:#000000;}
	.ft17{font-size:25px;font-family:"Inter",sans-serif;color:#000000;}
	.ft18{font-size:16px;font-family:"Inter",sans-serif;color:#000000;}
	.ft19{font-size:10px;font-family:"Inter",sans-serif;color:#000000;}
	.ft110{font-size:-1px;font-family:Helvetica;color:#000000;}
	.ft111{font-size:10px;line-height:20px;font-family:"Sriracha",cursive;color:#000000;}
	.ft111-inter{font-size:10px;line-height:20px;font-family:"Inter",sans-serif;color:#000000;}
</style>
</head>
<body bgcolor="#A0A0A0" vlink="blue" link="blue">
<div id="page1-div" style="position:relative;width:892px;height:1262px;">
<img width="892" height="1262" src="/v2.png" alt="background image"/>
<p style="position:absolute;top:48px;left:40px;white-space:nowrap" class="ft10">${data.pt_brand}</p>
<p style="position:absolute;top:0px;left:183px;white-space:nowrap" class="ft11">${data.product_name}</p>
<p style="position:absolute;top:28px;left:340px;white-space:nowrap" class="ft12">${data.pt_original_price}:</p>
<p style="position:absolute;top:56px;left:177px;white-space:nowrap" class="ft13">${data.discount_percentage}</p>
<p style="position:absolute;top:56px;left:347px;white-space:nowrap" class="ft14">${data.price}</p>
<p style="position:absolute;top:51px;left:499px;white-space:nowrap" class="ft16">${data.price_sale}</p>
<p style="position:absolute;top:133px;left:183px;white-space:nowrap" class="ft111">${data.pt_origin_country}: ${data.country_code} ${data.country_name}<br/><span class="ft111-inter">${data.pt_product_code}: ${data.product_code}</span></p>

</div>
</body>
</html>`;
}; 