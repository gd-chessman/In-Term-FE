export const v2Template = (data: {
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
	.ft10{font-size:37px;font-family:Times;color:#000000;}
	.ft11{font-size:14px;font-family:Times;color:#000000;}
	.ft12{font-size:11px;font-family:Times;color:#000000;}
	.ft13{font-size:49px;font-family:Times;color:#ffffff;}
	.ft14{font-size:55px;font-family:Times;color:#000000;}
	.ft15{font-size:19px;font-family:Times;color:#000000;}
	.ft16{font-size:88px;font-family:Times;color:#000000;}
	.ft17{font-size:25px;font-family:Times;color:#000000;}
	.ft18{font-size:16px;font-family:Times;color:#000000;}
	.ft19{font-size:10px;font-family:Times;color:#000000;}
	.ft110{font-size:-1px;font-family:Helvetica;color:#000000;}
	.ft111{font-size:10px;line-height:20px;font-family:Times;color:#000000;}
</style>
</head>
<body bgcolor="#A0A0A0" vlink="blue" link="blue">
<div id="page1-div" style="position:relative;width:892px;height:1262px;">
<img width="892" height="1262" src="/v2.png" alt="background image"/>
<p style="position:absolute;top:48px;left:40px;white-space:nowrap" class="ft10">Fikko</p>
<p style="position:absolute;top:87px;left:45px;white-space:nowrap" class="ft10">Cena</p>
<p style="position:absolute;top:0px;left:183px;white-space:nowrap" class="ft11">${data.product_name}</p>
<p style="position:absolute;top:28px;left:340px;white-space:nowrap" class="ft12">Běžná cena:</p>
<p style="position:absolute;top:68px;left:177px;white-space:nowrap" class="ft13">-75%</p>
<p style="position:absolute;top:68px;left:347px;white-space:nowrap" class="ft14">${data.price}</p>
<p style="position:absolute;top:60px;left:425px;white-space:nowrap" class="ft15">90</p>
<p style="position:absolute;top:51px;left:499px;white-space:nowrap" class="ft16">${data.print_date}</p>
<p style="position:absolute;top:60px;left:608px;white-space:nowrap" class="ft17">90</p>
<p style="position:absolute;top:98px;left:608px;white-space:nowrap" class="ft18">Kč</p>
<p style="position:absolute;top:133px;left:183px;white-space:nowrap" class="ft111">Země původu: ${data.country_name}<br/>EAN: ${data.product_code}</p>
<p style="position:absolute;top:155px;left:518px;white-space:nowrap" class="ft19">cena za 100g = ${data.price_per_100g} Kč</p>
</div>
</body>
</html>`;
}; 