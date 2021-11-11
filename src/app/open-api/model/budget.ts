/**
 * kkl Education API
 * Education new project|
 *
 * The version of the OpenAPI document: 1.4.1
 * Contact: yochai@one1.co.il
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { City } from './city';
import { SubBudget } from './subBudget';


export interface Budget { 
    desc?: string;
    kklAmount?: number | null;
    customerAmount?: number | null;
    type?: number | null;
    isByCity?: number | null;
    listCity?: Array<City> | null;
    cityId?: number | null;
    execution?: number | null;
    balanceFin?: number | null;
    isNeedCalculate?: number | null;
    incomeId?: number;
    incomeName?: string;
    expensesId?: number;
    expensesName?: string;
    subBudgetIncomeList?: Array<SubBudget>;
    subBudgetExpenseList?: Array<SubBudget>;
}

