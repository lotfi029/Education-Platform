import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
import { Product } from '../contracts/products/product';
import { TResult } from '../../abstractions/Result';
import { Abstractions } from './abstractions';
import { MyError } from '../../abstractions/Error';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  baseUrl = environment.apiUrl;
  products: Product[] = Array.from({ length: 100 }, (_, i) => {
    const categories = ["Electronics", "Books", "Clothing", "Toys", "Furniture"];
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    const price = (Math.random() * 1000 + 10).toFixed(2);
    
    return {
      id: i + 1,
      name: `Product ${i + 1}`,
      description: `This is the description for Product ${i + 1}.`,
      price: parseFloat(price),
      category: randomCategory,
      imageUrl: `https://via.placeholder.com/150?text=Product+${i + 1}`
    };
  });
  constructor(private httpClient: HttpClient) { }
  getProductsMock(): Observable<TResult<Product[]>> {
    return of(TResult.success<Product[]>(this.products));
  }
  getProductByIdMock(id: string): Observable<TResult<Product>> {
    const product = this.products.find(p => p.id === parseInt(id));
    if (product) {
      return of(TResult.success<Product>(product));
    } else {
      return of(TResult.fail<Product>(MyError.BadRequest(['Product not found'])));
    }
  }
  getProductByCategoryMock(category: string): Observable<TResult<Product[]>> {
    const filteredProducts = this.products.filter(p => p.category === category);
    return of(TResult.success<Product[]>(filteredProducts));
  }
  addProductMock(product: Product): Observable<TResult<Product>> {
    const newProduct = { ...product, id: this.products.length + 1 };
    this.products.push(newProduct);
    return of(TResult.success<Product>(newProduct));
  }
  updateProductMock(product: Product): Observable<TResult<Product>> {
    const index = this.products.findIndex(p => p.id === product.id);
    if (index !== -1) {
      this.products[index] = product;
      return of(TResult.success<Product>(product));
    } else {
      return of(TResult.fail<Product>(MyError.BadRequest(['Product not found'])));
    }
  }
  deleteProductMock(id: string): Observable<TResult<void>> {
    const index = this.products.findIndex(p => p.id === parseInt(id));
    if (index !== -1) {
      this.products.splice(index, 1);
      return of(TResult.success<void>(undefined));
    } else {
      return of(TResult.fail<void>(MyError.BadRequest(['Product not found'])));
    }
  }
  
  // addProduct(product: Product): Observable<TResult<Product>> {
  //   return this.httpClient.post<Product>(`${this.baseUrl}/products`, product).pipe(
  //     map((response: Product) => {
  //       return TResult.success<Product>(response);
  //     }),
  //     catchError((error: HttpErrorResponse) => {
  //       const myError = Abstractions.HandleError(error);
  //       return of(TResult.fail<Product>(myError));
  //     })
  //   );
  // }
  // updateProduct(product: Product): Observable<TResult<Product>> {
  //   return this.httpClient.put<Product>(`${this.baseUrl}/products/${product.id}`, product).pipe(
  //     map((response: Product) => {
  //       return TResult.success<Product>(response);
  //     }),
  //     catchError((error: HttpErrorResponse) => {
  //       const myError = Abstractions.HandleError(error);
  //       return of(TResult.fail<Product>(myError));
  //     })
  //   );
  // }
  // getProductByCategory(category: string): Observable<TResult<Array<Product>>> {
  //   return this.httpClient.get<Array<Product>>(`${this.baseUrl}/products/category/${category}`).pipe(
  //     map((response: Array<Product>) => {
  //       return TResult.success<Array<Product>>(response);
  //     }),
  //     catchError((error: HttpErrorResponse) => {
  //       const myError = Abstractions.HandleError(error);
  //       return of(TResult.fail<Array<Product>>(myError));
  //     })
  //   );
  // }
  // getProducts(): Observable<TResult<Product[]>> {
  //   return this.httpClient.get<Product[]>(`${this.baseUrl}/products`).pipe(
  //     map((response: Array<Product>) => {
  //       return TResult.success<Array<Product>>(response);
  //     }),
  //     catchError((error: HttpErrorResponse) => {
  //       const myError = Abstractions.HandleError(error);
  //       return of(TResult.fail<Array<Product>>(myError));
  //     })
  //   );
  // }
  // getProductById(id: string): Observable<TResult<Product>> {
  //   return this.httpClient.get<Product>(`${this.baseUrl}/products/${id}`).pipe(
  //     map((response: Product) => {
  //       return TResult.success<Product>(response);
  //     }),
  //     catchError((error: HttpErrorResponse) => {
  //       const myError = Abstractions.HandleError(error);
  //       return of(TResult.fail<Product>(myError));
  //     })
  //   );
  // }
  // deleteProduct(id: string): Observable<TResult<void>> {
  //   return this.httpClient.delete<void>(`${this.baseUrl}/products/${id}`).pipe(
  //     map(() => {
  //       return TResult.success<void>(undefined);
  //     }),
  //     catchError((error: HttpErrorResponse) => {
  //       const myError = Abstractions.HandleError(error);
  //       return of(TResult.fail<void>(myError));
  //     })
  //   );
  // } 



  
}
