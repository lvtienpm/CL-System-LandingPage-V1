// File: custom.js (Dành cho trang index.html)

$(document).ready(function () {
  const $grid = $(".grid");
  const $filterButtons = $(".filter-buttons");
  const initialItemsCount = 6; // Số item hiển thị cho mục "Tất cả"

  fetch("../json/vstudy.json") // Đảm bảo đường dẫn này chính xác
    .then((response) => response.json())
    .then((data) => {
      const allItems = data.showcase.items;

      // BƯỚC 1: RENDER TẤT CẢ ITEM RA HTML
      // Chúng ta tạo HTML cho TẤT CẢ các mục để Isotope "biết" về sự tồn tại của chúng.
      allItems.forEach((item) => {
        const itemHTML = `
            <div class="col-lg-4 col-md-6 video-item ${item.category}">
                <div class="video-card">
                    <div class="video-thumbnail">
                        <img alt="${item.title}" src="${item.imageSrc}" />
                    </div>
                    <h5 class="custom-font-1 video-title">${item.title}</h5>
                </div>
            </div>
        `;
        $grid.append(itemHTML);
      });

      // Chờ tất cả ảnh tải xong để tránh lỗi layout
      $grid.imagesLoaded(function () {
        var isotope = $grid.isotope({
          itemSelector: ".video-item",
          layoutMode: "fitRows",
        });

        // BƯỚC 2: ÁP DỤNG BỘ LỌC BAN ĐẦU
        // Ngay khi trang tải xong, chúng ta áp dụng bộ lọc cho "Tất cả"
        // để chỉ hiện 6 mục đầu tiên.
        isotope.isotope({
          filter: function (itemElem) {
            // Lấy vị trí (index) của item
            var index = $(itemElem).index();
            // Chỉ trả về true (hiển thị) nếu vị trí nhỏ hơn 6
            return index < initialItemsCount;
          },
        });

        // BƯỚC 3: XỬ LÝ KHI NHẤN NÚT LỌC
        $filterButtons.on("click", "button", function () {
          var filterValue = $(this).attr("data-filter");

          // Đây là logic cốt lõi
          if (filterValue === "*") {
            // NẾU LÀ "Tất cả": Lọc theo VỊ TRÍ
            isotope.isotope({
              filter: function (itemElem) {
                var index = $(itemElem).index();
                return index < initialItemsCount;
              },
            });
          } else {
            // NẾU LÀ DANH MỤC KHÁC: Lọc theo CLASS (tên danh mục)
            // Isotope sẽ tự động tìm tất cả các mục khớp với class này.
            isotope.isotope({ filter: filterValue });
          }

          // Cập nhật trạng thái active cho nút
          $filterButtons.find(".active").removeClass("active");
          $(this).addClass("active");
        });
      });
    })
    .catch((error) => console.error(error));
});
