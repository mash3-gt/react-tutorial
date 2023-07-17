// React
import React, { StrictMode } from "react";
// Webブラウザとやりとりするためのライブラリ．ReactDOM
import { createRoot } from "react-dom/client";
// コンポーネントようのスタイル
import "./styles.css";

// 自分が作成したコンポーネント（五目ならべ） 
import App from "./App";

// 以下で、最終成果物をpublicフォルダのindex.htmlに注入
// （仕組み不明）
const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);