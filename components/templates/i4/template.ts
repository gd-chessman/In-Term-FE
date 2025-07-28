
export const i4Template = (data: {
  product_name: string;
  product_code: string;
  price: string;
  price_sale: string;
  price_decimal: string;
  price_sale_decimal: string;
  discount_percentage: string;
  country_name: string;
  country_code: string;
  print_date: string;
  pt_brand: string;
  pt_origin_country: string;
  pt_product_code: string;
  pt_original_price: string;
  unit_price_info: string;
  product_info: string;
}) => {

  // Hàm helper để tạo một label
  const createLabel = (row: number, col: number) => {
    const positions = [
      // [top, left] cho mỗi cột
      [2.7, 11.9],   // cột 1
      [22, 31.3],  // cột 2  
      [41.3, 50.6]   // cột 3
    ];
    
    const baseTop = [3.9, 10.4, 16.9, 23.4, 29.9, 36.4, 42.9, 49.4]; // top positions cho mỗi hàng
    
    const currentTop = baseTop[row];
    const currentLeft = positions[col][0];
    const originLeft = positions[col][1];
    
         return `
 <div style="position:absolute;top:${currentTop}rem;left:${currentLeft}rem;width:18rem;">
   <p style="white-space:normal;overflow:hidden;word-wrap:break-word;line-height:1.0;" class="ft14"><b>${data.product_name}<br/></b>${data.product_info}</p>
   <p style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:1.25rem;line-height:1.0;" class="ft15"><b>Prodávající: ${data.pt_brand}<br/>${data.pt_product_code}: ${data.product_code} <span style="float:right;">${data.pt_origin_country}: ${data.country_name}</span></b></p>
 </div>`;
  };

  // Tạo tất cả labels bằng vòng lặp
  let allLabels = "";
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 3; col++) {
      allLabels += createLabel(row, col);
    }
  }

  return `<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="" xml:lang="">
<head>
<title></title>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
<style type="text/css">
<!--
	p {margin: 0; padding: 0;}	.ft10{font-size:8px;font-family:Times;color:#000000;}
	.ft11{font-size:8px;font-family:Times;color:#000000;}
	.ft12{font-size:10px;font-family:Times;color:#000000;}
	.ft13{font-size:8px;line-height:12px;font-family:Times;color:#000000;}
	.ft14{font-size:8px;line-height:12px;font-family:Times;color:#000000;}
	.ft15{font-size:10px;line-height:13px;font-family:Times;color:#000000;}
-->
</style>
</head>
<body vlink="blue" link="blue">
<div id="page1-div" style="position:relative;width:65rem;height:85rem;">
${allLabels}
</div>
</body>
</html>`;
};
