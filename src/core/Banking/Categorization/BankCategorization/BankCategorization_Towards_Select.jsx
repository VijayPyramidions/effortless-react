export const TowardsSelect = (
  toward,
  updatetriggerContraBanks,
  mainElementCategorize,
  updateresettemplate,
  updateSelectedTowards,
  updateUpdateTemplate,
  updatechangedTowards,
  paidTo,
  updatemnTransactionType,
  updateMainTransactionType,
  updatedispType,
  contraBanks,
  updatepaidTo,
  updatetemplate,
  updateselectedTowardsName,
  getlocation,
  taxidentification,
  defaultTransactionType,
  mobilereduce,
  pickerType,
  SelectedTowards,
  updateselectedPurposeName,
  updateinittowards,
  inittowards,
  mnTransactionType,
  updatepaidto,
  addAdvance,
  organization,
  user,
  updateadvancevoucher,
  updateVReference,
  updateshowLoader,
  openSnackBar,
  editadvancenumber,
  showadvance,
  updateshowAdvance,
  updateanothercategorization,
  updateopModal,
  updatealertdisplaymessage,
  updatealertwarning,
  updatebuttontext1,
  updatebuttontext2,
  updateclosebutton,
  updateAlertOpen,
  getchanged,
  updatetotalarr,
  setpaidTo,
  updatespecialTotal,
  updatemodifieddetails,
  editclicked
) => {
  updatetriggerContraBanks(false);

  if (toward && toward.etype) {
    updatechangedTowards({ etype: toward.etype, type: toward.otype });
  }
  if (toward && toward.name) {
    if (toward.name.toUpperCase() === 'EXPENSE') {
      let topelement = null;
      if (mainElementCategorize && mainElementCategorize.current) {
        topelement = mainElementCategorize.current.querySelector('#toppart');
      }
      const netheight =
        mainElementCategorize.current.parentNode.parentNode.offsetHeight -
        topelement.offsetHeight -
        mobilereduce -
        40 +
        60;
      if (pickerType === 'desktop') {
        mainElementCategorize.current.querySelector(
          '#datagridbox'
        ).style.height = `${netheight}px`;
      } else if (pickerType === 'mobile') {
        setTimeout(() => {
          if (
            mainElementCategorize &&
            mainElementCategorize.current &&
            mainElementCategorize.current.querySelector(
              '.categorization_gridElementExpense'
            )
          ) {
            mainElementCategorize.current
              .querySelector('.categorization_gridElementExpense')
              .classList.add('expensegrid');
            document
              .querySelector(
                '.DashboardViewContainer_dashboardBodyContainerhideNavBar'
              )
              .querySelector('div')
              .querySelector('div')
              .classList.add('heightchanged');
            document
              .querySelector(
                '.DashboardViewContainer_dashboardBodyContainerhideNavBar'
              )
              .querySelector('div')
              .querySelector('div')
              .classList.remove('heightchangedback');
          }
        }, 500);
      }
      setTimeout(() => {
        if (
          document.querySelector('.categorization_gridElementExpense') &&
          document
            .querySelector('.categorization_gridElementExpense')
            .querySelector(
              '.DashboardViewContainer_dashboardBodyContainerDesktop'
            ) &&
          pickerType === 'desktop'
        ) {
          const element = document
            .querySelector('.categorization_gridElementExpense')
            .querySelector(
              '.DashboardViewContainer_dashboardBodyContainerDesktop'
            )
            .querySelector('div')
            .querySelector('div');
          element.classList.add('increasebillbookingheight');
        }
      }, 200);
    } else if (toward.name.toUpperCase() !== 'EXPENSE') {
      if (
        mainElementCategorize &&
        mainElementCategorize.current &&
        mainElementCategorize.current.querySelector(
          '.categorization_gridElementExpense'
        )
      ) {
        mainElementCategorize.current
          .querySelector('.categorization_gridElementExpense')
          .classList.remove('expensegrid');
        if (
          document.querySelector('.categorization_gridElementExpense') &&
          document
            .querySelector('.categorization_gridElementExpense')
            .querySelector(
              '.DashboardViewContainer_dashboardBodyContainerDesktop'
            ) &&
          pickerType === 'desktop'
        ) {
          mainElementCategorize.current
            .querySelector('.categorization_gridElementExpense')
            .querySelector(
              '.DashboardViewContainer_dashboardBodyContainerDesktop'
            )
            .querySelector('div')
            .querySelector('div')
            .classList.remove('increasebillbookingheight');
        }
        if (pickerType === 'mobile') {
          document
            .querySelector(
              '.DashboardViewContainer_dashboardBodyContainerhideNavBar'
            )
            .querySelector('div')
            .querySelector('div')
            .classList.remove('heightchanged');
          document
            .querySelector(
              '.DashboardViewContainer_dashboardBodyContainerhideNavBar'
            )
            .querySelector('div')
            .querySelector('div')
            .classList.add('heightchangedback');
        }
      }
    }
    updateresettemplate(false);
    setTimeout(() => {
      if (localStorage.getItem('itemstatus') !== 'Edit' && !toward?.id) {
        updateSelectedTowards(!SelectedTowards);
      } else {
        updateSelectedTowards(true);
      }
      updateUpdateTemplate(!updatetemplate);
    }, 1000);
    updateselectedPurposeName(toward.name);
    if (
      paidTo.id.toUpperCase() === 'OTHER BANKS' ||
      (toward?.etype?.toLowerCase() === 'other banks')
    ) {
      updatemnTransactionType('');
      updateMainTransactionType('');
      updatedispType('Others');
      const newdata = {};
      newdata.name = toward.name;
      newdata.etype = toward.etype;
      contraBanks.forEach((bank) => {
        if (bank.name.toUpperCase() === toward.name.toUpperCase()) {
          newdata.id = bank.id;
        }
      });
      if (toward?.etype?.toLowerCase() === 'other banks') {
        updatepaidTo({ id: 'OTHER BANKS', name: 'N/A', type: toward.etype });
        updatepaidto({ id: 'OTHER BANKS', name: 'N/A', type: toward.etype });
      }
      if (
        mainElementCategorize &&
        mainElementCategorize.current &&
        mainElementCategorize.current.querySelector('#addadvancevalue')
      ) {
        mainElementCategorize.current.querySelector(
          '#addadvancevalue'
        ).innerHTML = '';
        mainElementCategorize.current.querySelector(
          '#addadvancevalue'
        ).style.height = '0px';
      }
      updateselectedTowardsName(newdata);
      updateinittowards(!inittowards);
      setTimeout(() => {
        updatemodifieddetails(true);
        updateVReference(String(Math.random()));
        setTimeout(() => {
          updateUpdateTemplate(!updatetemplate);
        }, 1000);
      }, 1000);
    } else {
      let taxselected = false;
      getlocation().state.masterslist.towards.data.forEach((towards) => {
        if (
          towards.entity_type &&
          (towards.entity_type.toUpperCase() ===
            (toward.etype && toward.etype.toUpperCase()) ||
            towards.entity_type
              .toUpperCase()
              .indexOf(`${toward.etype ? toward.etype.toUpperCase() : ''}_`) >
              -1)
        ) {
          taxidentification.forEach((tax) => {
            if (paidTo.name.toUpperCase() === tax.name.toUpperCase()) {
              if (
                towards.entity_type.toUpperCase() ===
                `${paidTo.type.toUpperCase()}_${tax.tag.toUpperCase()}`
              ) {
                taxselected = true;
                towards.purpose.forEach((purpose) => {
                  if (purpose.toUpperCase() === toward.name.toUpperCase()) {
                    const newdata = {};
                    newdata.name = toward.name;
                    newdata.id = towards.id;
                    if (
                      toward.name.toUpperCase() === 'EXPENSE' &&
                      defaultTransactionType !== 'Receipt'
                    ) {
                      updatemnTransactionType('Expense Categorization');
                      updateMainTransactionType(mnTransactionType);
                      newdata.name = 'Expense Categorization';
                      newdata.id = '';
                      updatedispType('Expenses');
                    }
                    if (toward.name.toUpperCase() === 'INCOME') {
                      updatemnTransactionType('Income Categorization');
                      updateMainTransactionType(mnTransactionType);
                      newdata.name = 'Expense Categorization';
                      newdata.id = '';
                      updatedispType('Income');
                    }
                    if (
                      toward.name.toUpperCase() !== 'EXPENSE' &&
                      toward.name.toUpperCase() !== 'INCOME'
                    ) {
                      updatemnTransactionType(
                        defaultTransactionType === 'Receipt'
                          ? towards.inflow_description
                          : towards.outflow_description
                      );
                      updateMainTransactionType(
                        defaultTransactionType === 'Receipt'
                          ? towards.inflow_description
                          : towards.outflow_description
                      );
                      updatedispType('Others');
                      if (toward.etype) {
                        updatepaidTo({
                          id: paidTo.id,
                          name: paidTo.name,
                          type: toward.etype,
                        });
                        updatepaidto({
                          id: paidTo.id,
                          name: paidTo.name,
                          type: toward.etype,
                        });
                      }
                    }
                    if (
                      localStorage.getItem('itemstatus') === 'Edit' &&
                      !editclicked
                    ) {
                      // blank area;
                    } else if (
                      (localStorage.getItem('itemstatus') === 'Edit' &&
                        editclicked) ||
                      localStorage.getItem('itemstatus') === 'Add'
                    ) {
                      if (
                        mnTransactionType === 'Bill Settlement' &&
                        (defaultTransactionType === 'Payment' ||
                          defaultTransactionType === 'Receipt') &&
                        mainElementCategorize &&
                        mainElementCategorize.current &&
                        mainElementCategorize.current.querySelector(
                          '#advancebutton'
                        )
                      ) {
                        if (
                          !mainElementCategorize.current.querySelector(
                            '#addadvanceholder'
                          )
                        ) {
                          mainElementCategorize.current.querySelector(
                            '#advancebutton'
                          ).innerHTML =
                            '<div class="addadvanceholder"><label class="addadvanceplus">+</label><span><a class="addadvance" href={" "} id = "addadvancevalue">Add Advance</a></span></div>';
                          mainElementCategorize.current
                            .querySelector('#advancebutton')
                            .addEventListener('click', (event) => {
                              addAdvance(
                                event,
                                mainElementCategorize,
                                paidTo,
                                organization,
                                user,
                                updateadvancevoucher,
                                updateVReference,
                                updateshowLoader,
                                openSnackBar,
                                editadvancenumber,
                                showadvance,
                                updateshowAdvance,
                                updateanothercategorization,
                                updateopModal,
                                updatealertdisplaymessage,
                                updatealertwarning,
                                updatebuttontext1,
                                updatebuttontext2,
                                updateclosebutton,
                                updateAlertOpen,
                                getchanged,
                                updatetotalarr,
                                updatespecialTotal
                              );
                            });
                        }
                      } else if (
                        mainElementCategorize.current.querySelector(
                          '#advancebutton'
                        )
                      ) {
                        mainElementCategorize.current.querySelector(
                          '#advancebutton'
                        ).innerHTML = '';
                      }
                    }
                    updateselectedTowardsName(newdata);
                    updateUpdateTemplate(!updatetemplate);
                  }
                });
              }
            }
          });
          if (!taxselected) {
            towards.purpose.forEach((purpose) => {
              if (purpose.toUpperCase() === toward.name.toUpperCase()) {
                const newdata = {};
                newdata.name = towards.name;
                newdata.id = towards.id;
                if (
                  toward.name.toUpperCase() === 'EXPENSE' &&
                  defaultTransactionType !== 'Receipt'
                ) {
                  updatemnTransactionType('Expense Categorization');
                  updateMainTransactionType(mnTransactionType);
                  newdata.name = 'Expense Categorization';
                  newdata.id = '';
                  updatedispType('Expenses');
                }
                if (toward.name.toUpperCase() === 'INCOME') {
                  updatemnTransactionType('Income Categorization');
                  updateMainTransactionType(mnTransactionType);
                  newdata.name = 'Expense Categorization';
                  newdata.id = '';
                  updatedispType('Income');
                }
                if (
                  toward.name.toUpperCase() !== 'EXPENSE' &&
                  toward.name.toUpperCase() !== 'INCOME'
                ) {
                  updatemnTransactionType(
                    defaultTransactionType === 'Receipt'
                      ? towards.inflow_description
                      : towards.outflow_description
                  );
                  updateMainTransactionType(
                    defaultTransactionType === 'Receipt'
                      ? towards.inflow_description
                      : towards.outflow_description
                  );
                  updatedispType('Others');
                  if (toward.etype) {
                    updatepaidTo({
                      id: paidTo.id,
                      name: paidTo.name,
                      type: toward.etype,
                    });
                    updatepaidto({
                      id: paidTo.id,
                      name: paidTo.name,
                      type: toward.etype,
                    });
                  }
                }
                if (
                  mnTransactionType === 'Bill Settlement' &&
                  (defaultTransactionType === 'Payment' ||
                    defaultTransactionType === 'Receipt') &&
                  mainElementCategorize &&
                  mainElementCategorize.current &&
                  mainElementCategorize.current.querySelector('#advancebutton')
                ) {
                  if (
                    !mainElementCategorize.current.querySelector(
                      '#addadvanceholder'
                    )
                  ) {
                    mainElementCategorize.current.querySelector(
                      '#advancebutton'
                    ).innerHTML =
                      '<div class="addadvanceholder"><label class="addadvanceplus">+</label><span><a class="addadvance" href={" "} id = "addadvancevalue">Add Advance</a></span></div>';
                    mainElementCategorize.current
                      .querySelector('#advancebutton')
                      .addEventListener('click', (event) => {
                        addAdvance(
                          event,
                          mainElementCategorize,
                          paidTo,
                          organization,
                          user,
                          updateadvancevoucher,
                          updateVReference,
                          updateshowLoader,
                          openSnackBar,
                          editadvancenumber,
                          showadvance,
                          updateshowAdvance,
                          updateanothercategorization,
                          updateopModal,
                          updatealertdisplaymessage,
                          updatealertwarning,
                          updatebuttontext1,
                          updatebuttontext2,
                          updateclosebutton,
                          updateAlertOpen,
                          getchanged,
                          updatetotalarr,
                          updatespecialTotal
                        );
                      });
                  }
                } else if (
                  mainElementCategorize.current.querySelector('#advancebutton')
                ) {
                  mainElementCategorize.current.querySelector(
                    '#advancebutton'
                  ).innerHTML = '';
                }
                updateselectedTowardsName(newdata);
                updateUpdateTemplate(!updatetemplate);
                if (localStorage.getItem('itemstatus') === 'Edit') {
                  setTimeout(() => {
                    updatemodifieddetails(true);
                    updateVReference(String(Math.random()));
                  }, 2000);
                }
              }
            });
          }
        }
      });
    }
  }
};
