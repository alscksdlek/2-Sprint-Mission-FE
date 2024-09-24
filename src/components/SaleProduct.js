import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import ProductContent from "./ProductContent.js";
import Pagination from "./Pagination.js";
import "../style/SaleProduct.css";
import useMediaQuery from "../hooks/useMediaQuery.js";
import { getProductList } from "../api.js";

function SaleProduct() {
  const navigate = useNavigate();
  const [saleProduct, setSaleProduct] = useState({
    products: [],
    totalCount: 0,
  });
  const [order, setOrder] = useState("createdAt");
  const [searchProduct, setSearchProduct] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("최신순");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [visibleProduct, setVisibleProduct] = useState(10);
  const { isMobile, isTablet, isDesktop } = useMediaQuery();

  useEffect(() => {
    if (isMobile) setVisibleProduct(4);
    else if (isTablet) setVisibleProduct(6);
    else if (isDesktop) setVisibleProduct(10);
  }, [isMobile, isTablet, isDesktop]);

  const sortSaleProduct = useCallback((list, order) => {
    return [...list].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  }, []);

  const fetchSaleProduct = async (order = "", searchProduct = "", page = 1) => {
    const params = {
      sort: order,
      keyword: searchProduct,
      page: page,
      pageSize: visibleProduct,
    };
    const data = await getProductList(params);
    if (data && data.products) {
      setSaleProduct(data);
      const totalProduct = data.totalCount;
      const totalPages = Math.ceil(totalProduct / visibleProduct);
      setTotalPages(totalPages);
    }
  };

  const handleSearch = (e) => setSearchProduct(e.target.value);

  const toggleOption = () => setOpen(!open);
  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setOpen(false);
    if (option === "최신순") {
      setOrder("createdAt");
    }
  };

  useEffect(() => {
    setTotalPages(Math.ceil(saleProduct.totalCount / visibleProduct));
  }, [visibleProduct, saleProduct.totalCount]);

  useEffect(() => {
    fetchSaleProduct(order, searchProduct, page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order, searchProduct, page]);

  const filteredProducts = saleProduct.products.filter((product) =>
    product.name.toLowerCase().includes(searchProduct.toLowerCase())
  );

  const sortedProducts = sortSaleProduct(filteredProducts, order);
  const paginatedProducts = sortedProducts.slice(
    (page - 1) * visibleProduct,
    page * visibleProduct
  );

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <div className="SaleProduct">
      <div className="saleBar">
        <h2 className="sale">판매중인 상품</h2>
        <div className="searchBar">
          <img src="/img/search.png" alt="검색 아이콘" className="searchImg" />
          <input
            type="text"
            placeholder="검색할 상품을 입력해주세요"
            value={searchProduct}
            onChange={handleSearch}
            className="searchInput"
          />
        </div>
        <button
          className="productRegistrationButton"
          onClick={() => navigate("/registration")}
        >
          상품 등록하기
        </button>
        <div className={`toggle ${open ? "open" : ""}`}>
          <button onClick={toggleOption} className="toggleButton">
            {selectedOption}
            <span>&nbsp;&nbsp;&nbsp;&nbsp;▼</span>
          </button>
          {open && (
            <ul className="toggleOption">
              <li
                onClick={() => handleOptionClick("최신순")}
                className="createAt"
              >
                최신순
              </li>
            </ul>
          )}
        </div>
      </div>
      <div className="productGrid">
        {paginatedProducts.map((product) => (
          <ProductContent
            key={product._id}
            product={product}
            useDescription={true}
          />
        ))}
      </div>
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

export default SaleProduct;
