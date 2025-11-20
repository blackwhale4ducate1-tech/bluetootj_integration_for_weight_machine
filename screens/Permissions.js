import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {Fragment, useEffect, useState} from 'react';
import axios from 'axios';
import {API_BASE_URL} from '../config';
import {useAuth} from '../components/AuthContext';
import {Picker} from '@react-native-picker/picker';
import CheckBox from '@react-native-community/checkbox';
import {useNavigation} from '@react-navigation/native';
import {
  COLORS,
  MaterialCommunityIcons,
  FONTS,
  FontAwesome6,
  Feather,
} from '../constants';
import TableStyles from '../components/TableStyles';

const screenWidth = Dimensions.get('screen').width;
const Permissions = () => {
  const navigation = useNavigation();
  const {data} = useAuth();

  const [roleOptions, setRoleOptions] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [permissions, setPermissions] = useState([]);

  const pageHierarchy = [
    {page: 'dashboard', parent: null},
    {page: 'billing', parent: null},
    {page: 'reports', parent: null},
    {page: 'accounts', parent: null},
    {page: 'master', parent: null},
    {page: 'settings', parent: null},
    {page: 'tools', parent: null},
    {page: 'purchase', parent: 'billing'},
    {page: 'sales', parent: 'billing'},
    {page: 'purchaseOrder', parent: 'billing'},
    {page: 'salesOrder', parent: 'billing'},
    {page: 'stockTransfer', parent: 'billing'},
    {page: 'openingStock', parent: 'billing'},
    {page: 'estimate', parent: 'billing'},
    {page: 'pettySales', parent: 'billing'},
    {page: 'purchaseReturn', parent: 'billing'},
    {page: 'purchaseReport', parent: 'reports'},
    {page: 'salesReport', parent: 'reports'},
    {page: 'salesOrderReport', parent: 'reports'},
    {page: 'stockTransferReport', parent: 'reports'},
    {page: 'openingStockReport', parent: 'reports'},
    {page: 'estimateReport', parent: 'reports'},
    {page: 'pettySalesReport', parent: 'reports'},
    {page: 'paymentReport', parent: 'reports'},
    {page: 'receiptReport', parent: 'reports'},
    {page: 'stocksReport', parent: 'reports'},
    {page: 'accountsReports', parent: 'reports'},
    {page: 'payments', parent: 'accounts'},
    {page: 'receipts', parent: 'accounts'},
    {page: 'trialBalance', parent: 'accounts'},
    {page: 'profitAndLoss', parent: 'accounts'},
    {page: 'balanceSheet', parent: 'accounts'},
    {page: 'productCategories', parent: 'master'},
    {page: 'productDetails', parent: 'master'},
    {page: 'customers', parent: 'master'},
    {page: 'vendors', parent: 'master'},
    {page: 'accountGroup', parent: 'master'},
    {page: 'ledgerGroup', parent: 'master'},
    {page: 'invoiceTemplates', parent: 'master'},
    {page: 'stores', parent: 'master'},
    {page: 'roles', parent: 'master'},
    {page: 'users', parent: 'master'},
    {page: 'permissions', parent: 'master'},
    {page: 'priceList', parent: 'master'},
    {page: 'productComposition', parent: 'master'},
    {page: 'purchaseDayBookReport', parent: 'purchaseReport'},
    {page: 'purchaseDayBookDetailReport', parent: 'purchaseReport'},
    {page: 'purchaseItemWiseReport', parent: 'purchaseReport'},
    {page: 'salesDayBookReport', parent: 'salesReport'},
    {page: 'salesDayBookDetailReport', parent: 'salesReport'},
    {page: 'salesItemWiseReport', parent: 'salesReport'},
    {page: 'salesOrderDayBookReport', parent: 'salesOrderReport'},
    {page: 'salesOrderDayBookDetailReport', parent: 'salesOrderReport'},
    {page: 'salesOrderItemWiseReport', parent: 'salesOrderReport'},
    {page: 'stockTransferDayBookReport', parent: 'stockTransferReport'},
    {page: 'stockTransferDayBookDetailReport', parent: 'stockTransferReport'},
    {page: 'stockTransferItemWiseReport', parent: 'stockTransferReport'},
    {page: 'openingStockDayBookReport', parent: 'openingStockReport'},
    {page: 'openingStockDayBookDetailReport', parent: 'openingStockReport'},
    {page: 'openingStockItemWiseReport', parent: 'openingStockReport'},
    {page: 'estimateDayBookReport', parent: 'estimateReport'},
    {page: 'estimateDayBookDetailReport', parent: 'estimateReport'},
    {page: 'estimateItemWiseReport', parent: 'estimateReport'},
    {page: 'pettySalesDayBookReport', parent: 'pettySalesReport'},
    {page: 'pettySalesDayBookDetailReport', parent: 'pettySalesReport'},
    {page: 'pettySalesItemWiseReport', parent: 'pettySalesReport'},
    {page: 'ledgerReport', parent: 'accountsReports'},
    {page: 'outstandingCustomerReport', parent: 'accountsReports'},
    {page: 'outstandingStatementReport', parent: 'accountsReports'},
    {page: 'ledgerSummarisedReport', parent: 'accountsReports'},
    {page: 'ledgerSummarisedBalanceSheet', parent: 'accountsReports'},
    {page: 'billByBillCustomerReport', parent: 'accountsReports'},
    {page: 'billByBillSupplierReport', parent: 'accountsReports'},
    {page: 'importStock', parent: 'tools'},
  ];

  const getRolesData = async company_name => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/getRoles?company_name=${company_name}`,
        {
          params: {
            include: 'id,role',
          },
        },
      );
      // console.log("Roles: " + JSON.stringify(response.data));
      const data = response.data;
      const roleOptions = data.map(item => ({
        value: item.id,
        label: item.role,
      }));
      setRoleOptions(roleOptions);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getRolesData(data.company_name);
  }, [data.company_name]);

  const fetchPermissions = async roleId => {
    try {
      // console.log("roleId: " + roleId);
      const response = await axios.post(
        `${API_BASE_URL}/api/getPermissionsById`,
        {
          role_id: roleId,
          company_name: data.company_name,
        },
      );
      if (response.data.message) {
        // console.log("Permissions: " + JSON.stringify(response.data.message));
        setPermissions(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updatePermission = async permission => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/updatePermission`,
        {
          permission: permission,
          role_id: selectedRole.value,
          company_name: data.company_name,
        },
      );
      if (response.data.message) {
        // console.log(
        //   "Updated Permission: " + JSON.stringify(response.data.message)
        // );
        // Update the permissions state with the updated data
        setPermissions(prevPermissions => {
          return prevPermissions.map(prevPermission =>
            prevPermission.page_id === permission.page_id
              ? response.data.message
              : prevPermission,
          );
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Recursive function to update parent "view" permission
  const updateParentViewPermission = async pageName => {
    const parentPage = pageHierarchy.find(item => item.page === pageName);
    if (parentPage && parentPage.parent) {
      // Find the parent page of the current page
      const parentPermission = permissions.find(
        p => p.page_name === parentPage.parent,
      );
      if (parentPermission && parentPermission.view !== 1) {
        // If the parent page's "view" permission is not checked, check it
        await updatePermission({
          ...parentPermission,
          view: 1,
        });
        // Recursively update the parent's parent "view" permission
        await updateParentViewPermission(parentPage.parent);
      }
    }
  };

  const handlePermissionChange = async (permission, type) => {
    if (type === 'view' && permission.view === 1) {
      // Check if any child permission has "view" checked
      const childPages = pageHierarchy.filter(
        page => page.parent === permission.page_name,
      );
      // Check if any child page has "view" checked
      const isAnyChildViewChecked = childPages.some(childPage => {
        const childPermission = permissions.find(
          p => p.page_name === childPage.page,
        );
        return childPermission && childPermission.view === 1;
      });
      if (isAnyChildViewChecked) {
        return;
      }
    }
    // Toggle the checkbox value locally before sending the update to the server
    const updatedPermission = {
      ...permission,
      [type]: permission[type] === 1 ? 0 : 1,
    };

    // Check if any of "add," "edit," or "delete" is checked
    const hasAddEditDelChecked =
      updatedPermission.add === 1 ||
      updatedPermission.edit === 1 ||
      updatedPermission.del === 1;

    // If any of them is checked and "view" is not checked, check "view"
    if (hasAddEditDelChecked && updatedPermission.view !== 1) {
      updatedPermission.view = 1;
    }
    // Update the permission in the backend
    await updatePermission(updatedPermission);
    // Check if any permission of the child is being changed from unchecked to checked
    if (
      (type === 'view' &&
        permission.view !== 1 &&
        updatedPermission.view === 1) ||
      (type === 'add' && permission.add !== 1 && updatedPermission.add === 1) ||
      (type === 'edit' &&
        permission.edit !== 1 &&
        updatedPermission.edit === 1) ||
      (type === 'del' && permission.del !== 1 && updatedPermission.del === 1)
    ) {
      // Update the parent "view" permission
      await updateParentViewPermission(permission.page_name);
    }
  };

  const renderPermissionRows = (parentPage = null, indentLevel = 0) => {
    const filteredPages = pageHierarchy.filter(
      page => page.parent === parentPage,
    );

    return filteredPages.map(page => {
      const permission = permissions.find(p => p.page_name === page.page);
      return (
        <View key={page.page}>
          <View style={TableStyles.row}>
            <Text
              style={[
                parentPage ? TableStyles.cell : TableStyles.cellBold,
                {textAlign: 'left'},
              ]}>
              {' '.repeat(indentLevel * 4)}
              {page.page}
            </Text>
            <Text style={TableStyles.cell}>
              <CheckBox
                value={permission && permission.view === 1}
                onValueChange={() => handlePermissionChange(permission, 'view')}
                disabled={selectedRole && selectedRole.value === 1}
              />
              <CheckBox
                value={permission && permission.add === 1}
                onValueChange={() => handlePermissionChange(permission, 'add')}
                disabled={selectedRole && selectedRole.value === 1}
              />
              <CheckBox
                value={permission && permission.edit === 1}
                onValueChange={() => handlePermissionChange(permission, 'edit')}
                disabled={selectedRole && selectedRole.value === 1}
              />
              <CheckBox
                value={permission && permission.del === 1}
                onValueChange={() => handlePermissionChange(permission, 'del')}
                disabled={selectedRole && selectedRole.value === 1}
              />
            </Text>
          </View>
          {renderPermissionRows(page.page, indentLevel + 1)}
        </View>
      );
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons
            name="keyboard-backspace"
            size={22}
            color={COLORS.black}
          />
        </TouchableOpacity>
        <Text style={styles.labelText}>Update Permissions</Text>
      </View>

      <View style={styles.pickerContainer}>
        <Text style={styles.pickertext}>Select Role</Text>
        <View style={styles.pickercontain}>
          <Picker
            selectedValue={selectedRole ? selectedRole.value : null}
            onValueChange={(itemValue, itemIndex) => {
              const selectedOption = roleOptions.find(
                option => option.value === itemValue,
              );
              setSelectedRole({
                value: selectedOption?.value,
                label: selectedOption?.label,
              });
              if (itemValue) {
                fetchPermissions(itemValue);
              } else {
                setPermissions([]);
              }
            }}
            // prompt="-- Select Role --"
            style={[styles.picker, {color: COLORS.black}]}>
            <Picker.Item label="-- Select Role --" value={null} />
            {roleOptions &&
              roleOptions.map((option, index) => (
                <Picker.Item
                  key={index}
                  label={option.label}
                  value={option.value}
                />
              ))}
          </Picker>
        </View>
      </View>
      {permissions.length > 0 && (
        <View style={TableStyles.tableContainer}>
          <View style={TableStyles.headerRow}>
            <Text style={[TableStyles.header, {textAlign: 'left'}]}>
              Page Name
            </Text>
            <Text style={TableStyles.header}>View/Add/Edit/Del</Text>
            {/* <Text style={TableStyles.header}>Add</Text>
            <Text style={TableStyles.header}>Edit</Text>
            <Text style={TableStyles.header}>Del</Text> */}
          </View>
          <View style={TableStyles.body}>{renderPermissionRows()}</View>
        </View>
      )}
    </ScrollView>
  );
};

export default Permissions;

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  actiontext: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.black,
    textTransform: 'capitalize',
  },
  cardContainer: {
    width: screenWidth * 0.9,
    borderWidth: 1,
    borderColor: COLORS.red,
    borderRadius: 5,
    marginVertical: 10,
    padding: 5,
  },
  pagename: {
    fontSize: 16,
    color: 'green',
    fontWeight: '700',
    marginVertical: 10,
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  containpage: {
    flexDirection: 'column',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  labelText: {
    fontSize: 16,
    color: COLORS.black,
    marginLeft: 20,
    fontWeight: '700',
  },
  pickertext: {
    fontSize: 16,
    color: COLORS.blue,
    marginTop: 30,
    textAlign: 'center',
    fontWeight: '700',
  },
  pickercontain: {
    marginLeft: 10,
    marginTop: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  permissionheading: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    color: COLORS.black,
    textAlign: 'center',
    marginRight: 5,
    fontWeight: '700',
  },
  pickerContainer: {
    marginBottom: 16,
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
  },
  permissionContainer: {
    marginTop: 16,
  },
});
