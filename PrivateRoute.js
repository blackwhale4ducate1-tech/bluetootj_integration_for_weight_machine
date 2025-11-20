import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Home from './screens/Home';
import Profile from './screens/Profile';
import Dashboard from './screens/Dashboard';
import SideNav from './SideNav';
import ProductCategories from './screens/ProductCategories';
import ProductDetails from './screens/ProductDetails';
import Customers from './screens/Customers';
import Vendors from './screens/Vendors';
import AccountGroup from './screens/AccountGroup';
import LedgerGroup from './screens/LedgerGroup';
import Stores from './screens/Stores';
import Roles from './screens/Roles';
import Users from './screens/Users';
import Permissions from './screens/Permissions';
import ProductEmptyScreen from './components/ProductEmptyScreen';
import Sales from './screens/Sales';
import Receipts from './screens/Receipts';
import Payments from './screens/Payments';
import TrialBalance from './screens/TrialBalance';
import BalanceSheet from './screens/BalanceSheet';
import ProfitAndLoss from './screens/ProfitAndLoss';
import PurchaseReport from './screens/PurchaseReport';
import SalesReport from './screens/SalesReport';
import SalesOrderReport from './screens/SalesOrderReport';
import StockTransferReport from './screens/StockTransferReport';
import PaymentReport from './screens/PaymentReport';
import ReceiptReport from './screens/ReceiptReport';
import StocksReport from './screens/StocksReport';
import OpeningStockReport from './screens/OpeningStockReport';
import AccountsReports from './screens/AccountsReports';
import SalesDayBookReport from './screens/SalesDayBookReport';
import SalesDayBookDetailReport from './screens/SalesDayBookDetailReport';
import SalesItemWiseReport from './screens/SalesItemWiseReport';
import SalesEdit from './screens/SalesEdit';
import PurchaseDayBookReport from './screens/PurchaseDayBookReport';
import PurchaseDayBookDetailReport from './screens/PurchaseDayBookDetailReport';
import PurchaseItemWiseReport from './screens/PurchaseItemWiseReport';
import SalesOrderDayBookReport from './screens/SalesOrderDayBookReport';
import SalesOrderDayBookDetailReport from './screens/SalesOrderDayBookDetailReport';
import SalesOrderItemWiseReport from './screens/SalesOrderItemWiseReport';
import StockTransferDayBookReport from './screens/StockTransferDayBookReport';
import StockTransferDayBookDetailReport from './screens/StockTransferDayBookDetailReport';
import StockTransferItemWiseReport from './screens/StockTransferItemWiseReport';
import OpeningStockDayBookReport from './screens/OpeningStockDayBookReport';
import OpeningStockDayBookDetailReport from './screens/OpeningStockDayBookDetailReport';
import OpeningStockItemWiseReport from './screens/OpeningStockItemWiseReport';
import LedgerReport from './screens/LedgerReport';
import OutstandingCustomerReport from './screens/OutstandingCustomerReport';
import OutstandingStatementReport from './screens/OutstandingStatementReport';
import AddEditSalesItem from './screens/AddEditSalesItem';
import Purchase from './screens/Purchase';
import AddEditPurchaseItem from './screens/AddEditPurchaseItem';
import SalesOrder from './screens/SalesOrder';
import {SalesProvider} from './components/SalesContext';
import {PurchaseProvider} from './components/PurchaseContext';
import {StockTransferProvider} from './components/StockTransferContext';
import StockTransfer from './screens/StockTransfer';
import AddEditStockTransferItem from './screens/AddEditStockTransferItem';
import OpeningStock from './screens/OpeningStock';
import {OpeningStockProvider} from './components/OpeningStockContext';
import SalesOrderEdit from './screens/SalesOrderEdit';
import PurchaseEdit from './screens/PurchaseEdit';
import StockTransferEdit from './screens/StockTransferEdit';
import OpeningStockEdit from './screens/OpeningStockEdit';
import {EstimateProvider} from './components/EstimateContext';
import Estimate from './screens/Estimate';
import EstimateEdit from './screens/EstimateEdit';
import EstimateDayBookReport from './screens/EstimateDayBookReport';
import EstimateDayBookDetailReport from './screens/EstimateDayBookDetailReport';
import EstimateItemWiseReport from './screens/EstimateItemWiseReport';
import EstimateReport from './screens/EstimateReport';
import {ProductCategoryProvider} from './components/ProductCategoryContext';
import ViewProductCategory from './screens/ViewProductCategory';
import AddEditProductCategory from './screens/AddEditProductCategory';
import {ProductDetailsProvider} from './components/ProductDetailsContext';
import ViewProductDetails from './screens/ViewProductDetails';
import AddEditProductDetails from './screens/AddEditProductDetails';
import {CustomersProvider} from './components/CustomersContext';
import ViewCustomer from './screens/ViewCustomer';
import AddEditCustomer from './screens/AddEditCustomer';
import {VendorsProvider} from './components/VendorsContext';
import ViewVendor from './screens/ViewVendor';
import AddEditVendor from './screens/AddEditVendor';
import {AccountGroupProvider} from './components/AccountGroupContext';
import ViewAccountGroup from './screens/ViewAccountGroup';
import AddEditAccountGroup from './screens/AddEditAccountGroup';
import {LedgerGroupProvider} from './components/LedgerGroupContext';
import ViewLedgerGroup from './screens/ViewLedgerGroup';
import AddEditLedgerGroup from './screens/AddEditLedgerGroup';
import {StoresProvider} from './components/StoresContext';
import ViewStore from './screens/ViewStore';
import AddEditStore from './screens/AddEditStore';
import {RolesProvider} from './components/RolesContext';
import ViewRole from './screens/ViewRole';
import AddEditRole from './screens/AddEditRole';
import {UsersProvider} from './components/UsersContext';
import ViewUser from './screens/ViewUser';
import AddEditUser from './screens/AddEditUser';
import {ReceiptsProvider} from './components/ReceiptsContext';
import ViewReceipt from './screens/ViewReceipt';
import AddEditReceipt from './screens/AddEditReceipt';
import {PaymentsProvider} from './components/PaymentsContext';
import ViewPayment from './screens/ViewPayment';
import AddEditPayment from './screens/AddEditPayment';
import PriceList from './screens/PriceList';
import {PriceListProvider} from './components/PriceListContext';
import ViewPriceList from './screens/ViewPriceList';
import AddEditPriceList from './screens/AddEditPriceList';
import {PettySalesProvider} from './components/PettySalesContext';
import PettySales from './screens/PettySales';
import PettySalesEdit from './screens/PettySalesEdit';
import PettySalesReport from './screens/PettySalesReport';
import PettySalesDayBookReport from './screens/PettySalesDayBookReport';
import PettySalesDayBookDetailsReport from './screens/PettySalesDayBookDetailsReport';
import PettySalesItemWiseReport from './screens/PettySalesItemWiseReport';
import {PurchaseReturnProvider} from './components/PurchaseReturnContext';
import PurchaseReturn from './screens/PurchaseReturn';
import PurchaseReturnEdit from './screens/PurchaseReturnEdit';
import PurchaseReturnReport from './screens/PurchaseReturnReport';
import PurchaseReturnDayBookReport from './screens/PurchaseReturnDayBookReport';
import PurchaseReturnDayBookDetailReport from './screens/PurchaseReturnDayBookDetailReport';
import PurchaseReturnItemWiseReport from './screens/PurchaseReturnItemWiseReport';
import {ProductionProvider} from './components/ProductionContext';
import Production from './screens/Production';
import ProductionEdit from './screens/ProductionEdit';
import AddEditPurchaseReturnItem from './screens/AddEditPurchaseReturnItem';
import {ProductCompositionProvider} from './components/ProductCompositionContext';
import ProductComposition from './screens/ProductComposition';
import ViewProductComposition from './screens/ViewProductComposition';
import AddEditProductComposition from './screens/AddEditProductComposition';

const ProductCategoriesStack = () => {
  const Stack = createStackNavigator();
  return (
    <ProductCategoryProvider>
      <Stack.Navigator
        initialRouteName="ProductCategories"
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="ProductCategories" component={ProductCategories} />
        <Stack.Screen
          name="ViewProductCategory"
          component={ViewProductCategory}
        />
        <Stack.Screen
          name="AddEditProductCategory"
          component={AddEditProductCategory}
        />
      </Stack.Navigator>
    </ProductCategoryProvider>
  );
};

const ProductDetailsStack = () => {
  const Stack = createStackNavigator();
  return (
    <ProductDetailsProvider>
      <Stack.Navigator
        initialRouteName="ProductDetails"
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="ProductDetails" component={ProductDetails} />
        <Stack.Screen
          name="ViewProductDetails"
          component={ViewProductDetails}
        />
        <Stack.Screen
          name="AddEditProductDetails"
          component={AddEditProductDetails}
        />
      </Stack.Navigator>
    </ProductDetailsProvider>
  );
};

const CustomersStack = () => {
  const Stack = createStackNavigator();
  return (
    <CustomersProvider>
      <Stack.Navigator
        initialRouteName="Customers"
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="Customers" component={Customers} />
        <Stack.Screen name="ViewCustomer" component={ViewCustomer} />
        <Stack.Screen name="AddEditCustomer" component={AddEditCustomer} />
      </Stack.Navigator>
    </CustomersProvider>
  );
};

const VendorsStack = () => {
  const Stack = createStackNavigator();
  return (
    <VendorsProvider>
      <Stack.Navigator
        initialRouteName="Vendors"
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="Vendors" component={Vendors} />
        <Stack.Screen name="ViewVendor" component={ViewVendor} />
        <Stack.Screen name="AddEditVendor" component={AddEditVendor} />
      </Stack.Navigator>
    </VendorsProvider>
  );
};

const AccountGroupStack = () => {
  const Stack = createStackNavigator();
  return (
    <AccountGroupProvider>
      <Stack.Navigator
        initialRouteName="AccountGroup"
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="AccountGroup" component={AccountGroup} />
        <Stack.Screen name="ViewAccountGroup" component={ViewAccountGroup} />
        <Stack.Screen
          name="AddEditAccountGroup"
          component={AddEditAccountGroup}
        />
      </Stack.Navigator>
    </AccountGroupProvider>
  );
};

const LedgerGroupStack = () => {
  const Stack = createStackNavigator();
  return (
    <LedgerGroupProvider>
      <Stack.Navigator
        initialRouteName="LedgerGroup"
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="LedgerGroup" component={LedgerGroup} />
        <Stack.Screen name="ViewLedgerGroup" component={ViewLedgerGroup} />
        <Stack.Screen
          name="AddEditLedgerGroup"
          component={AddEditLedgerGroup}
        />
      </Stack.Navigator>
    </LedgerGroupProvider>
  );
};

const StoresStack = () => {
  const Stack = createStackNavigator();
  return (
    <StoresProvider>
      <Stack.Navigator
        initialRouteName="Stores"
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="Stores" component={Stores} />
        <Stack.Screen name="ViewStore" component={ViewStore} />
        <Stack.Screen name="AddEditStore" component={AddEditStore} />
      </Stack.Navigator>
    </StoresProvider>
  );
};

const RolesStack = () => {
  const Stack = createStackNavigator();
  return (
    <RolesProvider>
      <Stack.Navigator
        initialRouteName="Roles"
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="Roles" component={Roles} />
        <Stack.Screen name="ViewRole" component={ViewRole} />
        <Stack.Screen name="AddEditRole" component={AddEditRole} />
      </Stack.Navigator>
    </RolesProvider>
  );
};

const UsersStack = () => {
  const Stack = createStackNavigator();
  return (
    <UsersProvider>
      <Stack.Navigator
        initialRouteName="Users"
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="Users" component={Users} />
        <Stack.Screen name="ViewUser" component={ViewUser} />
        <Stack.Screen name="AddEditUser" component={AddEditUser} />
      </Stack.Navigator>
    </UsersProvider>
  );
};

const ReceiptsStack = () => {
  const Stack = createStackNavigator();
  return (
    <ReceiptsProvider>
      <Stack.Navigator
        initialRouteName="Receipts"
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="Receipts" component={Receipts} />
        <Stack.Screen name="ViewReceipt" component={ViewReceipt} />
        <Stack.Screen name="AddEditReceipt" component={AddEditReceipt} />
      </Stack.Navigator>
    </ReceiptsProvider>
  );
};

const PaymentsStack = () => {
  const Stack = createStackNavigator();
  return (
    <PaymentsProvider>
      <Stack.Navigator
        initialRouteName="Payments"
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="Payments" component={Payments} />
        <Stack.Screen name="ViewPayment" component={ViewPayment} />
        <Stack.Screen name="AddEditPayment" component={AddEditPayment} />
      </Stack.Navigator>
    </PaymentsProvider>
  );
};

const SalesBilling = () => {
  const Stack = createStackNavigator();
  return (
    <SalesProvider>
      <Stack.Navigator
        initialRouteName="sales"
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="sales" component={Sales} />
        <Stack.Screen name="AddEditSalesItem" component={AddEditSalesItem} />
      </Stack.Navigator>
    </SalesProvider>
  );
};

const SalesEditBilling = ({route}) => {
  const Stack = createStackNavigator();
  const {invoice_no} = route.params;
  return (
    <SalesProvider>
      <Stack.Navigator
        initialRouteName="salesEdit"
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen
          name="salesEdit"
          component={SalesEdit}
          initialParams={{invoice_no}}
        />
        <Stack.Screen name="AddEditSalesItem" component={AddEditSalesItem} />
      </Stack.Navigator>
    </SalesProvider>
  );
};

const PettySalesBilling = () => {
  const Stack = createStackNavigator();
  return (
    <PettySalesProvider>
      <Stack.Navigator
        initialRouteName="pettySales"
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="pettySales" component={PettySales} />
        <Stack.Screen name="AddEditSalesItem" component={AddEditSalesItem} />
      </Stack.Navigator>
    </PettySalesProvider>
  );
};

const PettySalesEditBilling = ({route}) => {
  const Stack = createStackNavigator();
  const {invoice_no} = route.params;
  return (
    <PettySalesProvider>
      <Stack.Navigator
        initialRouteName="pettySalesEdit"
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen
          name="pettySalesEdit"
          component={PettySalesEdit}
          initialParams={{invoice_no}}
        />
        <Stack.Screen name="AddEditSalesItem" component={AddEditSalesItem} />
      </Stack.Navigator>
    </PettySalesProvider>
  );
};

const PurchaseBilling = () => {
  const Stack = createStackNavigator();
  return (
    <PurchaseProvider>
      <Stack.Navigator
        initialRouteName="purchase"
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="purchase" component={Purchase} />
        <Stack.Screen
          name="AddEditPurchaseItem"
          component={AddEditPurchaseItem}
        />
      </Stack.Navigator>
    </PurchaseProvider>
  );
};

const PurchaseEditBilling = ({route}) => {
  const Stack = createStackNavigator();
  const {invoice_no} = route.params;
  return (
    <PurchaseProvider>
      <Stack.Navigator
        initialRouteName="purchaseEdit"
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen
          name="purchaseEdit"
          component={PurchaseEdit}
          initialParams={{invoice_no}}
        />
        <Stack.Screen
          name="AddEditPurchaseItem"
          component={AddEditPurchaseItem}
        />
      </Stack.Navigator>
    </PurchaseProvider>
  );
};

const StockTransferBilling = () => {
  const Stack = createStackNavigator();
  return (
    <StockTransferProvider>
      <Stack.Navigator
        initialRouteName="stockTransfer"
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="stockTransfer" component={StockTransfer} />
        <Stack.Screen
          name="AddEditStockTransferItem"
          component={AddEditStockTransferItem}
        />
      </Stack.Navigator>
    </StockTransferProvider>
  );
};

const StockTransferEditBilling = ({route}) => {
  const Stack = createStackNavigator();
  const {invoice_no} = route.params;
  return (
    <StockTransferProvider>
      <Stack.Navigator
        initialRouteName="stockTransferEdit"
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen
          name="stockTransferEdit"
          component={StockTransferEdit}
          initialParams={{invoice_no}}
        />
        <Stack.Screen
          name="AddEditStockTransferItem"
          component={AddEditStockTransferItem}
        />
      </Stack.Navigator>
    </StockTransferProvider>
  );
};

const SalesOrderBilling = () => {
  const Stack = createStackNavigator();
  return (
    <SalesProvider>
      <Stack.Navigator
        initialRouteName="salesOrder"
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="salesOrder" component={SalesOrder} />
        <Stack.Screen name="AddEditSalesItem" component={AddEditSalesItem} />
      </Stack.Navigator>
    </SalesProvider>
  );
};

const SalesOrderEditBilling = ({route}) => {
  const Stack = createStackNavigator();
  const {invoice_no} = route.params;
  return (
    <SalesProvider>
      <Stack.Navigator
        initialRouteName="salesOrderEdit"
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen
          name="salesOrderEdit"
          component={SalesOrderEdit}
          initialParams={{invoice_no}}
        />
        <Stack.Screen name="AddEditSalesItem" component={AddEditSalesItem} />
      </Stack.Navigator>
    </SalesProvider>
  );
};

const OpeningStockBilling = () => {
  const Stack = createStackNavigator();
  return (
    <OpeningStockProvider>
      <Stack.Navigator
        initialRouteName="openingStock"
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="openingStock" component={OpeningStock} />
        <Stack.Screen
          name="AddEditPurchaseItem"
          component={AddEditPurchaseItem}
        />
      </Stack.Navigator>
    </OpeningStockProvider>
  );
};

const OpeningStockEditBilling = ({route}) => {
  const Stack = createStackNavigator();
  const {invoice_no} = route.params;
  return (
    <OpeningStockProvider>
      <Stack.Navigator
        initialRouteName="openingStockEdit"
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen
          name="openingStockEdit"
          component={OpeningStockEdit}
          initialParams={{invoice_no}}
        />
        <Stack.Screen
          name="AddEditPurchaseItem"
          component={AddEditPurchaseItem}
        />
      </Stack.Navigator>
    </OpeningStockProvider>
  );
};

const EstimateBilling = () => {
  const Stack = createStackNavigator();
  return (
    <EstimateProvider>
      <Stack.Navigator
        initialRouteName="estimate"
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="estimate" component={Estimate} />
        <Stack.Screen name="AddEditSalesItem" component={AddEditSalesItem} />
      </Stack.Navigator>
    </EstimateProvider>
  );
};

const EstimateEditBilling = ({route}) => {
  const Stack = createStackNavigator();
  const {invoice_no} = route.params;
  return (
    <EstimateProvider>
      <Stack.Navigator
        initialRouteName="estimateEdit"
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen
          name="estimateEdit"
          component={EstimateEdit}
          initialParams={{invoice_no}}
        />
        <Stack.Screen name="AddEditSalesItem" component={AddEditSalesItem} />
      </Stack.Navigator>
    </EstimateProvider>
  );
};

const PriceListStack = () => {
  const Stack = createStackNavigator();
  return (
    <PriceListProvider>
      <Stack.Navigator
        initialRouteName="PriceList"
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="PriceList" component={PriceList} />
        <Stack.Screen name="ViewPriceList" component={ViewPriceList} />
        <Stack.Screen name="AddEditPriceList" component={AddEditPriceList} />
      </Stack.Navigator>
    </PriceListProvider>
  );
};

const PurchaseReturnBilling = () => {
  const Stack = createStackNavigator();
  return (
    <PurchaseReturnProvider>
      <Stack.Navigator
        initialRouteName="purchaseReturn"
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="purchaseReturn" component={PurchaseReturn} />
        <Stack.Screen
          name="AddEditPurchaseReturnItem"
          component={AddEditPurchaseReturnItem}
        />
      </Stack.Navigator>
    </PurchaseReturnProvider>
  );
};

const PurchaseReturnEditBilling = ({route}) => {
  const Stack = createStackNavigator();
  const {invoice_no} = route.params;
  return (
    <PurchaseReturnProvider>
      <Stack.Navigator
        initialRouteName="purchaseReturnEdit"
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen
          name="purchaseReturnEdit"
          component={PurchaseReturnEdit}
          initialParams={{invoice_no}}
        />
        <Stack.Screen
          name="AddEditPurchaseReturnItem"
          component={AddEditPurchaseReturnItem}
        />
      </Stack.Navigator>
    </PurchaseReturnProvider>
  );
};

const ProductionBilling = () => {
  const Stack = createStackNavigator();
  return (
    <ProductionProvider>
      <Stack.Navigator
        initialRouteName="production"
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="production" component={Production} />
        <Stack.Screen
          name="AddEditPurchaseItem"
          component={AddEditPurchaseItem}
        />
      </Stack.Navigator>
    </ProductionProvider>
  );
};

const ProductionEditBilling = ({route}) => {
  const Stack = createStackNavigator();
  const {invoice_no} = route.params;
  return (
    <ProductionProvider>
      <Stack.Navigator
        initialRouteName="productionEdit"
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen
          name="productionEdit"
          component={ProductionEdit}
          initialParams={{invoice_no}}
        />
        <Stack.Screen
          name="AddEditPurchaseItem"
          component={AddEditPurchaseItem}
        />
      </Stack.Navigator>
    </ProductionProvider>
  );
};

const ProductCompositionStack = () => {
  const Stack = createStackNavigator();
  return (
    <ProductCompositionProvider>
      <Stack.Navigator
        initialRouteName="ProductComposition"
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen
          name="ProductComposition"
          component={ProductComposition}
        />
        <Stack.Screen
          name="ViewProductComposition"
          component={ViewProductComposition}
        />
        <Stack.Screen
          name="AddEditProductComposition"
          component={AddEditProductComposition}
        />
      </Stack.Navigator>
    </ProductCompositionProvider>
  );
};

const PrivateRoute = () => {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="Dashboard" component={Dashboard} />
      <Stack.Screen name="SideNav" component={SideNav} />
      <Stack.Screen
        name="ProductCategoriesStack"
        component={ProductCategoriesStack}
      />
      <Stack.Screen
        name="ProductDetailsStack"
        component={ProductDetailsStack}
      />
      <Stack.Screen name="CustomersStack" component={CustomersStack} />
      <Stack.Screen name="VendorsStack" component={VendorsStack} />
      <Stack.Screen name="AccountGroupStack" component={AccountGroupStack} />
      <Stack.Screen name="LedgerGroupStack" component={LedgerGroupStack} />
      <Stack.Screen name="StoresStack" component={StoresStack} />
      <Stack.Screen name="RolesStack" component={RolesStack} />
      <Stack.Screen name="UsersStack" component={UsersStack} />
      <Stack.Screen name="Permissions" component={Permissions} />
      <Stack.Screen name="ProductEmptyScreen" component={ProductEmptyScreen} />
      <Stack.Screen name="ReceiptsStack" component={ReceiptsStack} />
      <Stack.Screen name="PaymentsStack" component={PaymentsStack} />
      <Stack.Screen name="TrialBalance" component={TrialBalance} />
      <Stack.Screen name="BalanceSheet" component={BalanceSheet} />
      <Stack.Screen name="ProfitAndLoss" component={ProfitAndLoss} />
      <Stack.Screen name="purchaseReport" component={PurchaseReport} />
      <Stack.Screen name="salesReport" component={SalesReport} />
      <Stack.Screen name="pettySalesReport" component={PettySalesReport} />
      <Stack.Screen name="salesOrderReport" component={SalesOrderReport} />
      <Stack.Screen
        name="stockTransferReport"
        component={StockTransferReport}
      />
      <Stack.Screen name="paymentReport" component={PaymentReport} />
      <Stack.Screen name="receiptReport" component={ReceiptReport} />
      <Stack.Screen name="stocksReport" component={StocksReport} />
      <Stack.Screen name="openingStockReport" component={OpeningStockReport} />
      <Stack.Screen name="accountsReports" component={AccountsReports} />
      <Stack.Screen name="salesDayBookReport" component={SalesDayBookReport} />
      <Stack.Screen
        name="salesDayBookDetailReport"
        component={SalesDayBookDetailReport}
      />
      <Stack.Screen
        name="salesItemWiseReport"
        component={SalesItemWiseReport}
      />
      <Stack.Screen
        name="pettySalesDayBookReport"
        component={PettySalesDayBookReport}
      />
      <Stack.Screen
        name="pettySalesDayBookDetailsReport"
        component={PettySalesDayBookDetailsReport}
      />
      <Stack.Screen
        name="pettySalesItemWiseReport"
        component={PettySalesItemWiseReport}
      />
      <Stack.Screen
        name="purchaseDayBookReport"
        component={PurchaseDayBookReport}
      />
      <Stack.Screen
        name="purchaseDayBookDetailReport"
        component={PurchaseDayBookDetailReport}
      />
      <Stack.Screen
        name="purchaseItemWiseReport"
        component={PurchaseItemWiseReport}
      />
      <Stack.Screen
        name="salesOrderDayBookReport"
        component={SalesOrderDayBookReport}
      />
      <Stack.Screen
        name="salesOrderDayBookDetailReport"
        component={SalesOrderDayBookDetailReport}
      />
      <Stack.Screen
        name="salesOrderItemWiseReport"
        component={SalesOrderItemWiseReport}
      />
      <Stack.Screen
        name="stockTransferDayBookReport"
        component={StockTransferDayBookReport}
      />
      <Stack.Screen
        name="stockTransferDayBookDetailReport"
        component={StockTransferDayBookDetailReport}
      />
      <Stack.Screen
        name="stockTransferItemWiseReport"
        component={StockTransferItemWiseReport}
      />
      <Stack.Screen
        name="openingStockDayBookReport"
        component={OpeningStockDayBookReport}
      />
      <Stack.Screen
        name="openingStockDayBookDetailReport"
        component={OpeningStockDayBookDetailReport}
      />
      <Stack.Screen
        name="openingStockItemWiseReport"
        component={OpeningStockItemWiseReport}
      />
      <Stack.Screen name="ledgerReport" component={LedgerReport} />
      <Stack.Screen
        name="outstandingCustomerReport"
        component={OutstandingCustomerReport}
      />
      <Stack.Screen
        name="outstandingStatementReport"
        component={OutstandingStatementReport}
      />
      <Stack.Screen name="SalesBilling" component={SalesBilling} />
      <Stack.Screen name="PettySalesBilling" component={PettySalesBilling} />
      <Stack.Screen name="PurchaseBilling" component={PurchaseBilling} />
      <Stack.Screen name="SalesOrderBilling" component={SalesOrderBilling} />
      <Stack.Screen
        name="StockTransferBilling"
        component={StockTransferBilling}
      />
      <Stack.Screen
        name="OpeningStockBilling"
        component={OpeningStockBilling}
      />
      <Stack.Screen name="SalesEditBilling" component={SalesEditBilling} />
      <Stack.Screen
        name="PettySalesEditBilling"
        component={PettySalesEditBilling}
      />
      <Stack.Screen
        name="SalesOrderEditBilling"
        component={SalesOrderEditBilling}
      />
      <Stack.Screen
        name="PurchaseEditBilling"
        component={PurchaseEditBilling}
      />
      <Stack.Screen
        name="StockTransferEditBilling"
        component={StockTransferEditBilling}
      />
      <Stack.Screen
        name="OpeningStockEditBilling"
        component={OpeningStockEditBilling}
      />
      <Stack.Screen name="EstimateBilling" component={EstimateBilling} />
      <Stack.Screen
        name="EstimateEditBilling"
        component={EstimateEditBilling}
      />
      <Stack.Screen name="estimateReport" component={EstimateReport} />
      <Stack.Screen
        name="estimateDayBookReport"
        component={EstimateDayBookReport}
      />
      <Stack.Screen
        name="estimateDayBookDetailReport"
        component={EstimateDayBookDetailReport}
      />
      <Stack.Screen
        name="estimateItemWiseReport"
        component={EstimateItemWiseReport}
      />
      <Stack.Screen
        name="ViewProductCategory"
        component={ViewProductCategory}
      />
      <Stack.Screen name="PriceListStack" component={PriceListStack} />
      <Stack.Screen
        name="PurchaseReturnBilling"
        component={PurchaseReturnBilling}
      />
      <Stack.Screen
        name="PurchaseReturnEditBilling"
        component={PurchaseReturnEditBilling}
      />
      <Stack.Screen
        name="purchaseReturnReport"
        component={PurchaseReturnReport}
      />
      <Stack.Screen
        name="purchaseReturnDayBookReport"
        component={PurchaseReturnDayBookReport}
      />
      <Stack.Screen
        name="purchaseReturnDayBookDetailReport"
        component={PurchaseReturnDayBookDetailReport}
      />
      <Stack.Screen
        name="purchaseReturnItemWiseReport"
        component={PurchaseReturnItemWiseReport}
      />
      <Stack.Screen name="ProductionBilling" component={ProductionBilling} />
      <Stack.Screen
        name="productionEditBilling"
        component={ProductionEditBilling}
      />
      <Stack.Screen
        name="ProductCompositionStack"
        component={ProductCompositionStack}
      />
    </Stack.Navigator>
  );
};

export default PrivateRoute;
