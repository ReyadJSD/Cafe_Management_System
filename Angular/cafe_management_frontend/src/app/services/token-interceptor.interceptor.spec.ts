// import { TestBed } from '@angular/core/testing';
// import { HttpInterceptorFn } from '@angular/common/http';
// import { TokenInterceptor } from './token-interceptor.interceptor';
// import { tokenInterceptorInterceptor } from './token-interceptor.interceptor';

// describe('tokenInterceptorInterceptor', () => {
//   const interceptor: HttpInterceptorFn = (req, next) => 
//     TestBed.runInInjectionContext(() => tokenInterceptorInterceptor(req, next));

//   beforeEach(() => {
//     TestBed.configureTestingModule({});
//   });

//   it('should be created', () => {
//     expect(interceptor).toBeTruthy();
//   });
// });
import { TestBed } from '@angular/core/testing';
import { TokenInterceptor } from './token-interceptor.interceptor'; // Corrected import

describe('TokenInterceptor', () => { // Use the actual class name
  let interceptor: TokenInterceptor;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TokenInterceptor] // Add the interceptor to providers
    });
    interceptor = TestBed.inject(TokenInterceptor); // Inject the interceptor
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });
});