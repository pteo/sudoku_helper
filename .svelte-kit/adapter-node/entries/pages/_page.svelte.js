import { f as ensure_array_like, d as attr, e as escape_html, h as attr_class, c as pop, p as push } from "../../chunks/index.js";
function _page($$payload, $$props) {
  push();
  let commonNumbers;
  let sumOfNumbers = "";
  let combinationLength = "";
  let numbersToInclude = Array(6).fill("");
  let excludedNumbers = Array(6).fill("");
  let repeatNumbers = false;
  let results = [];
  let positionSummary = [];
  function findCommonNumbers(results2) {
    if (results2.length === 0) return [];
    let common = results2[0];
    for (let i = 1; i < results2.length; i++) {
      common = common.filter((number) => results2[i].includes(number));
    }
    return common;
  }
  commonNumbers = results.length > 0 ? findCommonNumbers(results) : [];
  const each_array = ensure_array_like(numbersToInclude);
  const each_array_1 = ensure_array_like(excludedNumbers);
  $$payload.out += `<div class="container mx-auto px-4 py-8 max-w-4xl"><div class="bg-white rounded-xl shadow-lg p-6 space-y-6"><h1 class="text-3xl font-bold text-primary text-center mb-8">Number Permutation Calculator</h1> <div class="grid grid-cols-1 md:grid-cols-2 gap-6"><div class="space-y-4"><label class="block"><span class="section-title">Sum of Numbers*</span> <input type="number"${attr("value", sumOfNumbers)} class="input-field" required></label> <label class="block"><span class="section-title">Combination Length*</span> <input type="number"${attr("value", combinationLength)} class="input-field" required></label></div> <div class="space-y-4"><div><h3 class="section-title">Numbers to be Included</h3> <div class="grid grid-cols-3 gap-2"><!--[-->`;
  for (let i = 0, $$length = each_array.length; i < $$length; i++) {
    each_array[i];
    $$payload.out += `<input type="number"${attr("value", numbersToInclude[i])} class="input-field"${attr("placeholder", `Number ${i + 1}`)}>`;
  }
  $$payload.out += `<!--]--></div></div> <div><h3 class="section-title">Excluded Numbers</h3> <div class="grid grid-cols-3 gap-2"><!--[-->`;
  for (let i = 0, $$length = each_array_1.length; i < $$length; i++) {
    each_array_1[i];
    $$payload.out += `<input type="number"${attr("value", excludedNumbers[i])} class="input-field"${attr("placeholder", `Number ${i + 1}`)}>`;
  }
  $$payload.out += `<!--]--></div></div></div></div> `;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> <div class="space-y-4"><label class="flex items-center space-x-2"><input type="checkbox"${attr("checked", repeatNumbers, true)} class="form-checkbox h-5 w-5 text-blue-600"> <span>Repeat Numbers</span></label> `;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--></div> <button class="btn-primary w-full">Show Permutations</button> `;
  if (results.length > 0) {
    $$payload.out += "<!--[-->";
    const each_array_4 = ensure_array_like(positionSummary);
    const each_array_6 = ensure_array_like(results);
    $$payload.out += `<div class="mt-6 space-y-6">`;
    if (commonNumbers.length > 0) {
      $$payload.out += "<!--[-->";
      const each_array_3 = ensure_array_like(commonNumbers);
      $$payload.out += `<div><h3 class="section-title">Numbers Present In All Combinations</h3> <div class="flex flex-wrap gap-2"><!--[-->`;
      for (let $$index_3 = 0, $$length = each_array_3.length; $$index_3 < $$length; $$index_3++) {
        let number = each_array_3[$$index_3];
        $$payload.out += `<span class="bg-green-100 text-green-800 px-2 py-1 rounded">${escape_html(number)}</span>`;
      }
      $$payload.out += `<!--]--></div></div>`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--> <div><h3 class="section-title">Position Summary</h3> <div class="bg-gray-50 rounded-lg p-4"><div class="grid grid-cols-1 gap-3"><!--[-->`;
    for (let position = 0, $$length = each_array_4.length; position < $$length; position++) {
      let numbers = each_array_4[position];
      const each_array_5 = ensure_array_like(numbers);
      $$payload.out += `<div class="flex items-center space-x-2"><span class="font-medium min-w-24">Position ${escape_html(position + 1)}:</span> <div class="flex flex-wrap gap-2"><!--[-->`;
      for (let $$index_4 = 0, $$length2 = each_array_5.length; $$index_4 < $$length2; $$index_4++) {
        let number = each_array_5[$$index_4];
        $$payload.out += `<span class="px-2 py-1 rounded">${escape_html(number)}</span>`;
      }
      $$payload.out += `<!--]--></div></div>`;
    }
    $$payload.out += `<!--]--></div></div></div> <div><h3 class="section-title">Results (${escape_html(results.length)} combinations found)</h3> <div class="bg-gray-50 rounded-lg p-4 max-h-60 overflow-y-auto"><!--[-->`;
    for (let $$index_7 = 0, $$length = each_array_6.length; $$index_7 < $$length; $$index_7++) {
      let result = each_array_6[$$index_7];
      const each_array_7 = ensure_array_like(result);
      $$payload.out += `<div class="py-1 border-b border-gray-200 last:border-0"><!--[-->`;
      for (let i = 0, $$length2 = each_array_7.length; i < $$length2; i++) {
        let number = each_array_7[i];
        $$payload.out += `<span${attr_class("", void 0, {
          "font-bold": commonNumbers.includes(number)
        })}>${escape_html(number)}${escape_html(i < result.length - 1 ? ", " : "")}</span>`;
      }
      $$payload.out += `<!--]--></div>`;
    }
    $$payload.out += `<!--]--></div></div></div>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--></div></div>`;
  pop();
}
export {
  _page as default
};
