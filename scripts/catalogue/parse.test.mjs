import assert from "node:assert/strict";
import test from "node:test";
import { parseBikeDetail } from "./parse.mjs";
import { matchEquipmentBike } from "../../lib/catalogue/match-equipment.mjs";

const HTML = `
<li data-id="10159" data-color="黒" data-image="https://cdn.rental819.com/a.jpg"
    data-default-option="168" data-custom-option="2" data-description="note"></li>
<li data-id="10160" data-color="白" data-image="https://cdn.rental819.com/b.jpg"
    data-default-option="440" data-custom-option="1"></li>
<div id="default_option">
  <ul>
    <li id="default_option_1"><span>トップケース</span></li>
    <li id="default_option_0"><span>サイドバッグ</span></li>
    <li id="default_option_2"><span>パニアケース</span></li>
    <li id="default_option_3"><span>スマホホルダー</span></li>
    <li id="default_option_4"><span>USBソケット</span></li>
    <li id="default_option_5"><span>USB-C type</span></li>
    <li id="default_option_6"><span>シガーソケット</span></li>
    <li id="default_option_7"><span>ETC車載器<br class="x" /></span></li>
    <li id="default_option_8"><span>グリップヒーター</span></li>
  </ul>
</div>
<div id="custom_option">
  <ul>
    <li id="custom_option_1"><span>トップケース</span></li>
    <li id="custom_option_0"><span>サイドバッグ</span></li>
    <li id="custom_option_2"><span>パニアケース</span></li>
  </ul>
</div>
`;

test("parses free and paid equipment per unit from the rental819 bitmask", () => {
  const detail = parseBikeDetail(HTML);
  assert.equal(detail.equipmentKnown, true);
  assert.deepEqual(detail.units[0].freeEquipment, ["phone_holder", "usb_c", "etc_reader"]);
  assert.deepEqual(detail.units[0].paidEquipment, ["topcase"]);
  // 440 = bits 3, 4, 5, 7 (the screenshot bike) plus unknown bit 8.
  assert.deepEqual(detail.units[1].freeEquipment, [
    "phone_holder",
    "usb",
    "usb_c",
    "etc_reader",
    "raw:グリップヒーター",
  ]);
  assert.deepEqual(detail.units[1].paidEquipment, ["sidebag"]);
  assert.deepEqual(detail.unmappedEquipment, ["グリップヒーター"]);
});

test("matches one catalogue bike and refuses an ambiguous model name", () => {
  const bikes = [
    { shop: "大阪国際空港店(伊丹空港)", pref: "ホンダ NC750X (2024) / P-4", maker: "ホンダ", model: "NC750X", paid: ["topcase"] },
    { shop: "大阪国際空港店(伊丹空港)", pref: "ホンダ NC750X (2023) / P-4", maker: "ホンダ", model: "NC750X", paid: ["sidebag"] },
    { shop: "大阪国際空港店(伊丹空港)", pref: "ヤマハ MT-09 (2022) / P-4", maker: "ヤマハ", model: "MT-09", paid: [] },
  ];
  const shop = "大阪国際空港店(伊丹空港)";
  assert.equal(matchEquipmentBike(shop, "ホンダ NC750X (2024) / P-4", bikes)?.paid.join(), "topcase");
  assert.equal(matchEquipmentBike(shop, "ホンダ NC750X (2024)", bikes)?.paid.join(), "topcase");
  assert.equal(matchEquipmentBike(shop, "ヤマハ MT-09", bikes)?.paid.length, 0);
  assert.equal(matchEquipmentBike(shop, "NC750X", bikes), null);
  assert.equal(matchEquipmentBike(shop, "CB400", bikes), null);
  assert.equal(matchEquipmentBike("別の店", "ヤマハ MT-09", bikes), null);
});
