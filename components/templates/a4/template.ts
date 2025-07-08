export const a4Template = (data: {
  product_name: string;
  product_code: string;
  price: string;
  country_name: string;
  print_date: string;
  price_per_100g: string;
}) => {
  return `<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="" xml:lang="">
<head>
<title></title>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
<style type="text/css">
	p {margin: 0; padding: 0;}	
	.ft10{font-size:88px;font-family:Times;color:#ffffff;}
	.ft11{font-size:31px;font-family:Times;color:#000000;}
	.ft12{font-size:22px;font-family:Times;color:#000000;}
	.ft13{font-size:16px;font-family:Times;color:#000000;}
	.ft14{font-size:118px;font-family:Times;color:#ffffff;}
	.ft15{font-size:125px;font-family:Times;color:#000000;}
	.ft16{font-size:65px;font-family:Times;color:#000000;}
	.ft17{font-size:268px;font-family:Times;color:#000000;}
	.ft18{font-size:73px;font-family:Times;color:#000000;}
	.ft19{font-size:50px;font-family:Times;color:#000000;}
	.ft110{font-size:25px;font-family:Times;color:#000000;}
	.ft111{font-size:-1px;font-family:Helvetica;color:#000000;}
</style>
</head>
<body bgcolor="#A0A0A0" vlink="blue" link="blue">
<div id="page1-div" style="position:relative;width:892px;height:1262px;">
<img width="892" height="1262" src="/a4.png" alt="background image"/>
<p style="position:absolute;top:203px;left:217px;white-space:nowrap" class="ft10">Fikko Cena</p>
<p style="position:absolute;top:349px;left:-12px;white-space:nowrap" class="ft11">${data.product_name}</p>
<p style="position:absolute;top:406px;left:26px;white-space:nowrap" class="ft12">Země původu: ${data.country_name}</p>
<p style="position:absolute;top:468px;left:26px;white-space:nowrap" class="ft13">EAN: ${data.product_code}</p>
<p style="position:absolute;top:464px;left:387px;white-space:nowrap" class="ft12">Běžná cena:</p>
<p style="position:absolute;top:529px;left:33px;white-space:nowrap" class="ft14">-75%</p>
<p style="position:absolute;top:530px;left:478px;white-space:nowrap" class="ft15">${data.price}</p>
<p style="position:absolute;top:506px;left:642px;white-space:nowrap" class="ft16">90</p>
<p style="position:absolute;top:676px;left:260px;white-space:nowrap" class="ft17">${data.print_date}</p>
<p style="position:absolute;top:677px;left:583px;white-space:nowrap" class="ft18">90</p>
<p style="position:absolute;top:755px;left:583px;white-space:nowrap" class="ft19">Kč</p>
<p style="position:absolute;top:901px;left:302px;white-space:nowrap" class="ft110">cena za 100g = ${data.price_per_100g} Kč</p>
</div>
</body>
</html>`;
}; 