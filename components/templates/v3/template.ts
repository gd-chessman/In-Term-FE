export const v3Template = (data: {
  product_name: string;
  product_code: string;
  price: string;
  price_sale: string;
  discount_percentage: string;
  country_name: string;
  country_code: string;
  print_date: string;
}) => {
  return `<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="" xml:lang="">
<head>
<title></title>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
<style type="text/css">
	p {margin: 0; padding: 0;}	
	.ft10{font-size:58px;font-family:Times;color:#ffffff;}
	.ft11{font-size:22px;font-family:Times;color:#000000;}
	.ft12{font-size:10px;font-family:Times;color:#000000;}
	.ft13{font-size:16px;font-family:Times;color:#000000;}
	.ft14{font-size:64px;font-family:Times;color:#ffffff;}
	.ft15{font-size:79px;font-family:Times;color:#000000;}
	.ft16{font-size:28px;font-family:Times;color:#000000;}
	.ft17{font-size:140px;font-family:Times;color:#000000;}
	.ft18{font-size:50px;font-family:Times;color:#000000;}
	.ft19{font-size:31px;font-family:Times;color:#000000;}
	.ft110{font-size:13px;font-family:Times;color:#000000;}
	.ft111{font-size:-1px;font-family:Helvetica;color:#000000;}
</style>
</head>
<body bgcolor="#A0A0A0" vlink="blue" link="blue">
<div id="page1-div" style="position:relative;width:892px;height:1262px;">
<img width="892" height="1262" src="/v3.png" alt="background image"/>
<p style="position:absolute;top:14px;left:294px;white-space:nowrap" class="ft10">Fikko Cena</p>
<p style="position:absolute;top:64px;left:112px;white-space:nowrap" class="ft11">${data.product_name}</p>
<p style="position:absolute;top:95px;left:9px;white-space:nowrap" class="ft12">Země původu: ${data.country_code} ${data.country_name}</p>
<p style="position:absolute;top:117px;left:323px;white-space:nowrap" class="ft13">Běžná cena:</p>
<p style="position:absolute;top:166px;left:13px;white-space:nowrap" class="ft14">${data.discount_percentage}</p>
<p style="position:absolute;top:161px;left:355px;white-space:nowrap" class="ft15">${data.price}</p>
<p style="position:absolute;top:126px;left:628px;white-space:nowrap" class="ft17">${data.price_sale}</p>
<p style="position:absolute;top:243px;left:9px;white-space:nowrap" class="ft110">EAN: ${data.product_code}</p>

</div>
</body>
</html>`;
}; 