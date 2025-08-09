// File: custom.js (Dành cho trang index.html)

$(document).ready(function () {
  const $grid = $(".grid");
  const $filterButtons = $(".filter-buttons");
  const initialItemsCount = 6; // Số item hiển thị

  fetch("../json/vstudy.json")
    .then((response) => response.json())
    .then((data) => {
      const allItems = data.showcase.items;

      // Chỉ lấy 6 item đầu tiên
      const initialItems = allItems.slice(0, initialItemsCount);

      // Tạo HTML và chèn vào grid
      initialItems.forEach((item) => {
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

      // Chờ ảnh tải xong rồi khởi tạo Isotope
      $grid.imagesLoaded(function () {
        var isotope = $grid.isotope({
          itemSelector: ".video-item",
          layoutMode: "fitRows",
        });

        // Gán sự kiện cho các nút lọc
        $filterButtons.on("click", "button", function () {
          var filterValue = $(this).attr("data-filter");
          isotope.isotope({ filter: filterValue });

          $filterButtons.find(".active").removeClass("active");
          $(this).addClass("active");
        });
      });
    })
    .catch((error) => console.error(error));
});
