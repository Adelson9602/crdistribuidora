
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Login') },
      { 
        path: 'desktop', 
        component: () => import('layouts/LayoutApp'),
        children: [
          // { path: '', component: () => import('pages/index'), meta: {requiresAuth: true} }
          { path: '', component: () => import('pages/desktop'), meta: {requiresAuth: true} }
     
        ]
      },
      {
        path: 'access',
        component: () => import('layouts/LayoutApp'),
        meta: {requiresAuth: true} ,
        children: [
          { path: 'goals', component: () => import('pages/Access/Goals'), meta: {requiresAuth: true} },
          { path: 'permissions', component: () => import('pages/Access/Permissions'), meta: {requiresAuth: true} },
          { path: 'profile', component: () => import('pages/Access/Profile'), meta: {requiresAuth: true} },
          { path: 'users', component: () => import('pages/Access/Users'), meta: {requiresAuth: true} }, 
        ],
      },
      {
        path: 'warehouse',
        component: () => import('layouts/LayoutApp'),
        meta: {requiresAuth: true} ,
        children: [
          { path: 'articles', component: () => import('pages/Warehouse/Articles'), meta: {requiresAuth: true} },
          { path: 'categories', component: () => import('pages/Warehouse/Categories'), meta: {requiresAuth: true} },
          { path: 'warehouse_transfer', component: () => import('pages/Warehouse/WarehouseTransfer'), meta: {requiresAuth: true} },
          { path: 'inventory', component: () => import('pages/Warehouse/Inventory'), meta: {requiresAuth: true} }, 
        ],
      },
      {
        path: 'master',
        component: () => import('layouts/LayoutApp'),
        meta: {requiresAuth: true} ,
        children: [
          
          { path: 'percentsales', component: () => import('pages/Master/PercentSales'), meta: {requiresAuth: true} },
          { path: 'charges', component: () => import('pages/Master/Charges'), meta: {requiresAuth: true} },
      
        ],
      },
      {
        path: 'purchases',
        component: () => import('layouts/LayoutApp'),
        meta: {requiresAuth: true} ,
        children: [
          { path: 'income', component: () => import('pages/Purchases/Income'), meta: {requiresAuth: true} },
          { path: 'providers', component: () => import('pages/Purchases/Providers'), meta: {requiresAuth: true} },
          { path: 'departures_guarantees', component: () => import('pages/Purchases/DeparturesGuarantees'), meta: {requiresAuth: true} }, 
        ],
      },
      {
        path: 'sales',
        component: () => import('layouts/LayoutApp'),
        meta: {requiresAuth: true} ,
        children: [
          { path: 'sales', component: () => import('pages/Sales/Sales'), meta: {requiresAuth: true} },
          { path: 'sales_guarantees', component: () => import('pages/Sales/SalesGuarantees'), meta: {requiresAuth: true} }, 
          { path: 'customers', component: () => import('pages/Sales/Customers'), meta: {requiresAuth: true} }, 
          { path: 'stock_inquiry', component: () => import('pages/Sales/StockInquiry'), meta: {requiresAuth: true} }, 
        ],
      },
      {
        path: 'check_purchases',
        component: () => import('layouts/LayoutApp'),
        meta: {requiresAuth: true} ,
        children: [
          { path: 'check_purchases', component: () => import('pages/CheckPurchases/CheckPurchases'), meta: {requiresAuth: true} },
        ],
      },
      {
        path: 'consult_sales',
        component: () => import('layouts/LayoutApp'),
        meta: {requiresAuth: true} ,
        children: [
          { path: 'consult_sales', component: () => import('pages/ConsultSales/ConsultSales'), meta: {requiresAuth: true} },
          { path: 'consult_seller', component: () => import('pages/ConsultSales/ConsultSeller'), meta: {requiresAuth: true} },
          { path: 'consult_utility', component: () => import('pages/ConsultSales/ConsultUtility'), meta: {requiresAuth: true} },
          { path: 'sales_to_list', component: () => import('pages/ConsultSales/SalesToList'), meta: {requiresAuth: true} },
        ],
      },
      {
        path: 'check_credits',
        component: () => import('layouts/LayoutApp'),
        meta: {requiresAuth: true} ,
        children: [
          { path: 'customer_credits', component: () => import('pages/CheckCredits/CustomerCredits'), meta: {requiresAuth: true} },
          { path: 'provider_credits', component: () => import('pages/CheckCredits/ProviderCredits'), meta: {requiresAuth: true} },
        ],
      },
      {
        path: 'payment_confirmation',
        component: () => import('layouts/LayoutApp'),
        meta: {requiresAuth: true} ,
        children: [
          { path: 'credits_confirmation', component: () => import('pages/PaymentConfirmation/CreditsConfirmation'), meta: {requiresAuth: true} },
          { path: 'sales_confirmation', component: () => import('pages/PaymentConfirmation/SalesConfirmation'), meta: {requiresAuth: true} },
        ],
      },
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
