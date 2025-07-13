export const a4Template = (data: {
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
	.ft10{font-size:88px;font-family:"Sriracha",cursive;color:#ffffff;}
	.ft11{font-size:31px;font-family:"Inter",sans-serif;color:#000000;}
	.ft12{font-size:22px;font-family:"Sriracha",cursive;color:#000000;}
	.ft12-inter{font-size:22px;font-family:"Inter",sans-serif;color:#000000;}
	.ft13{font-size:16px;font-family:"Inter",sans-serif;color:#000000;}
	.ft14{font-size:115px;font-family:"Sriracha",cursive;color:#ffffff;}
	.ft15{font-size:120px;font-family:"Sriracha",cursive;color:#000000;}
	.ft16{font-size:65px;font-family:"Inter",sans-serif;color:#000000;}
	.ft17{font-size:220px;font-family:"Sriracha",cursive;color:#000000;}
	.ft18{font-size:73px;font-family:"Inter",sans-serif;color:#000000;}
	.ft19{font-size:50px;font-family:"Inter",sans-serif;color:#000000;}
	.ft110{font-size:25px;font-family:"Inter",sans-serif;color:#000000;}
	.ft111{font-size:-1px;font-family:Helvetica;color:#000000;}
</style>
</head>
<body bgcolor="#A0A0A0" vlink="blue" link="blue">
<div id="page1-div" style="position:relative;width:892px;height:1262px;">
<img width="892" height="1262" src="/a4.png" alt="background image"/>
<p style="position:absolute;top:192px;left:217px;white-space:nowrap" class="ft10">${data.pt_brand}</p>
<p style="position:absolute;top:349px;left:8px;white-space:nowrap" class="ft11">${data.product_name}</p>
<p style="position:absolute;top:406px;left:26px;white-space:nowrap" class="ft12">${data.pt_origin_country}: ${data.country_code} ${data.country_name}</p>
<p style="position:absolute;top:468px;left:26px;white-space:nowrap" class="ft13">${data.pt_product_code} : ${data.product_code}</p>
<p style="position:absolute;top:464px;left:387px;white-space:nowrap" class="ft12-inter">${data.pt_original_price} : </p>
<p style="position:absolute;top:480px;left:33px;white-space:nowrap" class="ft14">${data.discount_percentage}</p>
<p style="position:absolute;top:480px;left:415px;white-space:nowrap" class="ft15">${data.price}</p>
<p style="position:absolute;top:676px;left:100px;white-space:nowrap" class="ft17">${data.price_sale}</p> 

</div>
</body>
</html>`;
}; 