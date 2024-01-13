<template>
  <template v-if="isLogin">
    <div class="alert alert-primary mt-5" role="alert">載入中...</div>
  </template>
  <template v-else>
    <div class="container">
      <div class="row py-3">
        <div class="col-md-7">
          <div class="d-flex justify-content-between">
            <h2>產品列表</h2>
            <button class="btn btn-primary" @click="openModal('new')">
              建立新的產品
            </button>
          </div>

          <table class="table table-hover mt-4">
            <thead>
              <tr>
                <th width="150">產品名稱</th>
                <th width="120">原價</th>
                <th width="120">售價</th>
                <th width="150">是否啟用</th>
                <th width="120">查看細節</th>
                <th width="120">編輯</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="product in products" :key="product.id">
                <td width="150">{{ product.title }}</td>
                <td width="120">
                  {{ product.origin_price }}
                </td>
                <td width="120">
                  {{ product.price }}
                </td>
                <td width="120">
                  <span v-if="product.is_enabled" class="text-success"
                    >啟用</span
                  >
                  <span v-else class="text-danger">未啟用</span>
                </td>
                <td width="120">
                  <button
                    type="button"
                    class="btn btn-primary"
                    @click="choseProduct(product)"
                  >
                    查看細節
                  </button>
                </td>
                <td>
                  <div class="btn-group">
                    <button
                      type="button"
                      class="btn btn-outline-primary btn-sm"
                      @click="openModal('edit', product)"
                    >
                      編輯
                    </button>
                    <button
                      type="button"
                      class="btn btn-outline-danger btn-sm"
                      @click="openModal('delete', product)"
                    >
                      刪除
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <p>
            目前有 <span>{{ products.length }}</span> 項產品
          </p>
        </div>
        <div class="col-md-5">
          <h2>單一產品細節</h2>
          <template v-if="tempProduct.title">
            <div class="card mb-3">
              <img
                :src="tempProduct.imageUrl"
                class="card-img-top primary-image"
                alt="主圖"
              />
              <div class="card-body">
                <h5 class="card-title">
                  {{ tempProduct.title }}
                  <span class="badge bg-primary ms-2">{{
                    tempProduct.category
                  }}</span>
                </h5>
                <p class="card-text">商品描述：{{ tempProduct.description }}</p>
                <p class="card-text">商品內容：{{ tempProduct.content }}</p>
                <div class="d-flex">
                  <p class="card-text me-2">{{ tempProduct.price }}</p>
                  <p class="card-text text-secondary">
                    <del>{{ tempProduct.origin_price }}</del>
                  </p>
                  {{ tempProduct.unit }} / 元
                </div>
              </div>
            </div>
            <template
              v-for="(img, index) in tempProduct.imagesUrl"
              :key="index"
            >
              <img v-if="img" :src="img" :alt="index + 1" class="images m-2" />
            </template>
          </template>
          <p v-else class="text-secondary">請選擇一個商品查看</p>
        </div>
      </div>
    </div>
  </template>
  <!-- Modal -->
  <div
    id="productModal"
    class="modal fade"
    tabindex="-1"
    aria-labelledby="productModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-xl">
      <div class="modal-content border-0">
        <div class="modal-header bg-dark text-white">
          <h5 id="productModalLabel" class="modal-title">
            <span v-if="isAdd">新增產品</span>
            <span v-else>編輯產品</span>
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="col-sm-4">
              <div class="mb-3">
                <label for="imageUrl" class="form-label">主要圖片</label>
                <input
                  v-model="tempProduct.imageUrl"
                  type="text"
                  class="form-control mb-2"
                  placeholder="請輸入圖片連結"
                />
                <img class="img-fluid" :src="tempProduct.imageUrl" />
              </div>
              <h3 class="mb-3">多圖新增</h3>
              <!-- 我多圖陣列裡有東西才顯示(有按新增圖片) -->
              <div v-if="Array.isArray(tempProduct.imagesUrl)">
                <div
                  class="mb-1"
                  v-for="(image, index) in tempProduct.imagesUrl"
                  :key="index"
                >
                  <div class="mb-3">
                    <label for="imageUrl" class="form-label">圖片網址</label>
                    <input
                      v-model="tempProduct.imagesUrl[index]"
                      type="text"
                      class="form-control"
                      placeholder="請輸入圖片連結"
                    />
                  </div>
                  <img class="img-fluid" :src="image" />
                </div>
                <!-- 新增刪除會一直在最下面，不是每個圖各別控制，要刪只會刪最後一筆 -->
                <div
                  v-if="
                    !tempProduct.imagesUrl.length ||
                    tempProduct.imagesUrl[tempProduct.imagesUrl.length - 1]
                  "
                >
                  <button
                    class="btn btn-outline-primary btn-sm d-block w-100"
                    @click="tempProduct.imagesUrl.push('')"
                  >
                    新增圖片
                  </button>
                </div>
                <div v-else>
                  <!-- 因為有推空的，所以沒資料時也是要刪掉 -->
                  <button
                    class="btn btn-outline-danger btn-sm d-block w-100"
                    @click="tempProduct.imagesUrl.pop()"
                  >
                    刪除圖片
                  </button>
                </div>
              </div>
              <div v-else>
                <button
                  class="btn btn-outline-primary btn-sm d-block w-100"
                  @click="createImages"
                >
                  新增圖片
                </button>
              </div>
            </div>

            <div class="col-sm-8">
              <div class="mb-3">
                <label for="title" class="form-label">標題</label>
                <input
                  id="title"
                  v-model="tempProduct.title"
                  type="text"
                  class="form-control"
                  placeholder="請輸入標題"
                />
              </div>

              <div class="row">
                <div class="mb-3 col-md-6">
                  <label for="category" class="form-label">分類</label>
                  <input
                    id="category"
                    v-model="tempProduct.category"
                    type="text"
                    class="form-control"
                    placeholder="請輸入分類"
                  />
                </div>
                <div class="mb-3 col-md-6">
                  <label for="price" class="form-label">單位</label>
                  <input
                    id="unit"
                    v-model="tempProduct.unit"
                    type="text"
                    class="form-control"
                    placeholder="請輸入單位"
                  />
                </div>
              </div>

              <div class="row">
                <div class="mb-3 col-md-6">
                  <label for="origin_price" class="form-label">原價</label>
                  <input
                    id="origin_price"
                    v-model.number="tempProduct.origin_price"
                    type="number"
                    min="0"
                    class="form-control"
                    placeholder="請輸入原價"
                  />
                </div>
                <div class="mb-3 col-md-6">
                  <label for="price" class="form-label">售價</label>
                  <input
                    id="price"
                    v-model.number="tempProduct.price"
                    type="number"
                    min="0"
                    class="form-control"
                    placeholder="請輸入售價"
                  />
                </div>
              </div>
              <hr />

              <div class="mb-3">
                <label for="description" class="form-label">產品描述</label>
                <textarea
                  id="description"
                  v-model="tempProduct.description"
                  type="text"
                  class="form-control"
                  placeholder="請輸入產品描述"
                >
                </textarea>
              </div>
              <div class="mb-3">
                <label for="content" class="form-label">說明內容</label>
                <textarea
                  id="description"
                  v-model="tempProduct.content"
                  type="text"
                  class="form-control"
                  placeholder="請輸入說明內容"
                >
                </textarea>
              </div>
              <div class="mb-3">
                <div class="form-check">
                  <input
                    id="is_enabled"
                    v-model="tempProduct.is_enabled"
                    class="form-check-input"
                    type="checkbox"
                    :true-value="1"
                    :false-value="0"
                  />
                  <label class="form-check-label" for="is_enabled"
                    >是否啟用</label
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-outline-secondary"
            data-bs-dismiss="modal"
          >
            取消
          </button>
          <button type="button" class="btn btn-primary" @click="updateProduct">
            確認
          </button>
        </div>
      </div>
    </div>
  </div>
  <div
    id="delProductModal"
    class="modal fade"
    tabindex="-1"
    aria-labelledby="delProductModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content border-0">
        <div class="modal-header bg-danger text-white">
          <h5 id="delProductModalLabel" class="modal-title">
            <span>刪除產品</span>
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          是否刪除
          <strong class="text-danger">{{ tempProduct.title }}</strong>
          商品(刪除後將無法恢復)。
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-outline-secondary"
            data-bs-dismiss="modal"
          >
            取消
          </button>
          <button type="button" class="btn btn-danger" @click="delProduct">
            確認刪除
          </button>
        </div>
      </div>
    </div>
  </div>
  <!-- Modal -->
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { Modal } from "bootstrap";

const router = useRouter();

const apiPath = "bintest";
const isLogin = ref(false);
const products = ref([]);
const isAdd = ref(false);

const tempProduct = ref({
  imagesUrl: [],
});

const productModal = ref(null);
const delProductModal = ref(null);
onMounted(() => {
  isLogin.value = true;

  const token = document.cookie.replace(
    /(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/,
    "$1"
  );
  //把token塞進header裡面去驗證用
  axios.defaults.headers.common.Authorization = token;

  checkIsLogin();
  //把modal實例化
  productModal.value = new Modal(document.getElementById("productModal"), {
    keyboard: false,
  });

  delProductModal.value = new Modal(
    document.getElementById("delProductModal"),
    {
      keyboard: false,
    }
  );
});

//確認login狀態
const checkIsLogin = () => {
  axios
    .post("https://vue3-course-api.hexschool.io/v2/api/user/check")
    .then(() => {
      getData();
    })
    .catch((err) => {
      alert(err.response.data.message);
      //沒登入踢回去登入
      router.push("/");
    });
};

//取得產品資料
const getData = () => {
  isLogin.value = true;

  const url = `https://vue3-course-api.hexschool.io/v2/api/${apiPath}/admin/products`;
  axios
    .get(url)
    .then((response) => {
      isLogin.value = false;

      products.value = response.data.products;
    })
    .catch((err) => {
      alert(err.response.data.message);
    });
};

//選擇產品
const choseProduct = (product) => {
  tempProduct.value = product;
};

//開彈窗
const openModal = (isNew, product) => {
  if (isNew === "new") {
    tempProduct.value = {
      imagesUrl: [],
    };
    isAdd.value = true;
    productModal.value.show();
  } else if (isNew === "edit") {
    tempProduct.value = { ...product };
    isAdd.value = false;
    productModal.value.show();
  } else if (isNew === "delete") {
    tempProduct.value = { ...product };
    delProductModal.value.show();
  }
};

const createImages = () => {
  tempProduct.value.imagesUrl = [];
  //推一筆空的 Array.isArray為true 也讓之後的v-modal直接把他替換掉 用index去看要換哪筆(邏輯上是會照順序)
  tempProduct.value.imagesUrl.push("");
};

//新增or編輯
const updateProduct = () => {
  //新增
  let url = `https://vue3-course-api.hexschool.io/v2/api/${apiPath}/admin/product`;
  let http = "post";
  //編輯
  if (!isAdd.value) {
    url = `https://vue3-course-api.hexschool.io/v2/api/${apiPath}/admin/product/${tempProduct.value.id}`;
    http = "put";
  }

  axios[http](url, { data: tempProduct.value })
    .then((response) => {
      alert(response.data.message);
      //新增成功關彈窗
      productModal.value.hide();
      //重拿一次資料 也能直接推到原本資料裡面可以少打一次api
      getData();
    })
    .catch((err) => {
      alert(err.response.data.message);
    });
};

//刪除產品
const delProduct = () => {
  console.log(tempProduct.value.id);

  const url = `https://vue3-course-api.hexschool.io/v2/api/${apiPath}/admin/product/${tempProduct.value.id}`;

  axios
    .delete(url)
    .then((response) => {
      alert(response.data.message);
      delProductModal.value.hide();
      //刪除完一樣重拿
      getData();
      //刪除後需清空防止留著原本選擇的產品
      tempProduct.value = {
        imagesUrl: [],
      };
    })
    .catch((err) => {
      alert(err.response.data.message);
    });
};
</script>

<style scoped>
img {
  object-fit: contain;
  max-width: 100%;
}

.primary-image {
  height: 300px;
}

.images {
  height: 150px;
}
</style>
