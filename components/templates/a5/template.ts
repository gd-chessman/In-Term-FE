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
<style type="text/css">
	p {margin: 0; padding: 0;}	
	.ft10{font-size:65px;font-family:Times;color:#ffffff;}
	.ft11{font-size:28px;font-family:Times;color:#000000;}
	.ft12{font-size:13px;font-family:Times;color:#000000;}
	.ft13{font-size:10px;font-family:Times;color:#000000;}
	.ft14{font-size:19px;font-family:Times;color:#000000;}
	.ft15{font-size:80px;font-family:Times;color:#ffffff;}
	.ft16{font-size:88px;font-family:Times;color:#000000;}
	.ft17{font-size:43px;font-family:Times;color:#000000;}
	.ft18{font-size:193px;font-family:Times;color:#000000;}
	.ft19{font-size:58px;font-family:Times;color:#000000;}
	.ft110{font-size:25px;font-family:Times;color:#000000;}
	.ft111{font-size:-1px;font-family:Helvetica;color:#000000;}
</style>
</head>
<body bgcolor="#A0A0A0" vlink="blue" link="blue">
<div id="page1-div" style="position:relative;width:892px;height:1262px;">
<img width="892" height="1262" src="/a5.png" alt="background image"/>
<p style="position:absolute;top:30px;left:275px;white-space:nowrap" class="ft10">${data.pt_brand}</p>
<p style="position:absolute;top:111px;left:29px;white-space:nowrap" class="ft11">${data.product_name}</p>
<p style="position:absolute;top:160px;left:26px;white-space:nowrap" class="ft12">${data.pt_origin_country}: ${data.country_code} ${data.country_name}</p>
<p style="position:absolute;top:192px;left:26px;white-space:nowrap" class="ft13">${data.pt_product_code}: ${data.product_code}</p>
<p style="position:absolute;top:179px;left:472px;white-space:nowrap" class="ft14">${data.pt_original_price}:</p>
<p style="position:absolute;top:227px;left:83px;white-space:nowrap" class="ft15">${data.discount_percentage}</p>
<p style="position:absolute;top:224px;left:509px;white-space:nowrap" class="ft16">${data.price}</p>
<p style="position:absolute;top:305px;left:357px;white-space:nowrap" class="ft18">${data.price_sale}</p>

</div>
</body>
</html>`;
}; 