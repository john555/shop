export interface Product {
  body_html:       string;
  created_at:      Date;
  handle:          string;
  id:              string;
  images:          Image[];
  options:         Options;
  product_type:    string;
  published_at:    Date;
  published_scope: string;
  status:          string;
  tags:            string;
  template_suffix: string;
  title:           string;
  updated_at:      Date;
  variants:        Variant[];
  vendor:          string;
}

export interface Image {
  id:          string;
  product_id:  number;
  position:    number;
  created_at:  Date;
  updated_at:  Date;
  width:       number;
  height:      number;
  src:         string;
  variant_ids: string[];
}

export interface Options {
  id:         string;
  product_id: number;
  name:       string;
  position:   number;
  values:     string[];
}

export interface Variant {
  barcode:              string;
  compare_at_price:     null;
  created_at:           Date;
  fulfillment_service:  string;
  grams:                number;
  weight:               number;
  weight_unit:          string;
  id:                   string;
  inventory_item_id:    number;
  inventory_management: string;
  inventory_policy:     string;
  inventory_quantity:   number;
  option1:              string;
  position:             number;
  price:                number;
  product_id:           number;
  requires_shipping:    boolean;
  sku:                  string;
  taxable:              boolean;
  title:                string;
  updated_at:           Date;
}
