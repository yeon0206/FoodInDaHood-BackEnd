const express = require("express");
const router = express.Router();
const { Vendor } = require("../models/Vendors");
const { Category } = require("../models/Categories");
const vendors_samples = require("../db/vendor_samples.js");

router.get("/vendor/vendor-search", (req, res) => {
  //우선순위,
  //1.주소
  //2.음식 카테고리
  //3.타이틀명
  if (!req.query.keyword) {
    res.json({ "err": "검색에 필요한 키워드가 없습니다." });
    return;
  }

  var keyword = decodeURI(req.query.keyword);

  // var startIdx = req.query.startIdx;
  // var endIdx = req.query.endIdx;
  Vendor.find().then(((items) => {

    var locationFilter = items.filter((item) => {
      if (item.address.indexOf(keyword) !== -1) {
        return item;
      }
    });

    if (!locationFilter.length) {
      Category.find().then((categoryItems) => {
        var categoryFilter = categoryItems.filter((categoryItem) => {
          if (categoryItem.foodname === keyword) {
            return categoryItem;
          }
        });
        if (!categoryFilter.length) {
          var titleFilter = items.filter((item) => {
            if (item.title.indexOf(keyword) !== -1) {
              return item;
            }
          })
          if (!titleFilter.length) {
            res.json({ "err": "타이틀 검색결과가 없습니다." });
            return;
          } else {
            let renderTitle = titleFilter.slice();
            renderTitle.sort((a, b) => {
              return (
                b.rate - a.rate
              );
            });
            res.json(renderTitle);
            return;
          }
        } else {
          Vendor.find().then((vendorAll) => {
            var categoryFilterResult = vendorAll.filter((vendor) => {
              var hasCategory = vendor.food_categories.some((cateItem) => {
                return cateItem.category_id === categoryFilter[0]._id;
              })
              if (hasCategory) return vendor;
            })
            let renderCategory = categoryFilterResult.slice();
            res.json(renderCategory);
            return;
          });
        }
      })
    } else {
      let renderLocation = locationFilter.slice(); // 10개씩 뿌릴 경우 startIdx, endIdx 넣기
      res.json(renderLocation);
      return;
    }
  }))
});

module.exports = router;
