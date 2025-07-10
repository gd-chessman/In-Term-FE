export const v1Template = (data: {
  product_name: string;
  product_code: string;
  price: string;
  discount_percentage: string;
  country_name: string;
  print_date: string;
}) => {
  return `<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="" xml:lang="">
<head>
<title></title>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
<style type="text/css">
	p {margin: 0; padding: 0;}	
	.ft10{font-size:55px;font-family:Times;color:#000000;}
	.ft11{font-size:14px;font-family:Times;color:#000000;}
	.ft12{font-size:13px;font-family:Times;color:#000000;}
	.ft13{font-size:58px;font-family:Times;color:#ffffff;}
	.ft14{font-size:61px;font-family:Times;color:#000000;}
	.ft15{font-size:34px;font-family:Times;color:#000000;}
	.ft16{font-size:103px;font-family:Times;color:#000000;}
	.ft17{font-size:37px;font-family:Times;color:#000000;}
	.ft18{font-size:25px;font-family:Times;color:#000000;}
	.ft19{font-size:10px;font-family:Times;color:#000000;}
	.ft110{font-size:-1px;font-family:Helvetica;color:#000000;}
	.ft111{font-size:10px;line-height:22px;font-family:Times;color:#000000;}
</style>
</head>
<body bgcolor="#A0A0A0" vlink="blue" link="blue">
<div id="page1-div" style="position:relative;width:892px;height:1262px;">
<img width="892" height="1262" src="/v1.png" alt="background image"/>
<p style="position:absolute;top:11px;left:55px;white-space:nowrap" class="ft10">Fikko</p>
<p style="position:absolute;top:68px;left:62px;white-space:nowrap" class="ft10">Cena</p>
<p style="position:absolute;top:7px;left:268px;white-space:nowrap" class="ft11">${data.product_name}</p>
<p style="position:absolute;top:31px;left:493px;white-space:nowrap" class="ft12">Běžná cena:</p>
<p style="position:absolute;top:64px;left:272px;white-space:nowrap" class="ft13">${data.discount_percentage}</p>
<p style="position:absolute;top:68px;left:497px;white-space:nowrap" class="ft14">${data.price}</p>
<p style="position:absolute;top:47px;left:704px;white-space:nowrap" class="ft16">${data.print_date}</p>
<p style="position:absolute;top:131px;left:268px;white-space:nowrap" class="ft111">Země původu: ${data.country_name}<br/>EAN: ${data.product_code}</p>

</div>
</body>
</html>`;
}; 