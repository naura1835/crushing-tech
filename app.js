const shopifyLogo = document.querySelector(".nav-bar__logo img");
const notificationBtn = document.querySelector(".nav-bar__notification-btn");
const notificationWindow = document.querySelector(".alert-pop-up");
const noticationWindowMenuItems = notificationWindow.querySelectorAll(
  ".alert-pop-up__header__btn-grp button"
);
const menuBtn = document.querySelector(".nav-bar__menu-btn");
const menuList = document.querySelector(".menu-list");
const menuListItems = menuList.querySelectorAll("[role='menuitem']");
const overlay = document.querySelector(".overlay");
const closeBannerBtn = document.querySelector(".plan-banner__btn--close");
const planBanner = document.querySelector(".plan-banner");
const collapsibleBtn = document.querySelector(".setup-guide__collapse-btn");
const collapsibleBtnIcon = document.querySelector(
  ".setup-guide__collapse-btn img"
);
const collapsibleContainer = document.querySelector(".setup-steps");
const setupStepsListItems =
  collapsibleContainer.querySelectorAll(".setup-steps__item");
const allToggleAccordionText = document.querySelectorAll(
  ".setup-steps__item__label__btn"
);
const stepsAccordion = document.querySelectorAll(".setup-steps__item__details");
const checkboxes = document.querySelectorAll(".setup-steps__item__checkbox");
const progressText = document.querySelector(".setup-guide__progress__text");
const progressBarFilledLine = document.querySelector(
  ".setup-guide__progress__bar--filled"
);

const CHECKED_CLASS = "mark-as-done";
const HIDDEN_CLASS = "hidden";
let completed = 0;

notificationBtn.addEventListener("click", toggleNotifications);
menuBtn.addEventListener("click", toggleMenu);
closeBannerBtn.addEventListener("click", closePlanBanner);
collapsibleBtn.addEventListener("click", toggleCollapsibleSection);
allToggleAccordionText.forEach((element) =>
  element.addEventListener("click", toggleAccordion)
);
checkboxes.forEach((element, elementIndex) => {
  element.addEventListener("click", () => toggleChecked(element));
  element.addEventListener("keyup", (event) => {
    if (event.keyCode == 32) {
      //activate checkbox if space key is pressed
      toggleChecked(element);
    }

    handleEnterandSpaceKeyPress(event, elementIndex, checkboxes);
  });
});
menuListItems.forEach((menuItem, menuItemIndex) => {
  menuItem.addEventListener("keyup", (event) =>
    handleArrowKeyPress(event, menuItemIndex, menuListItems)
  );
});

allToggleAccordionText.forEach((tabPanelLabel, tabPanelLabelIndex) => {
  tabPanelLabel.addEventListener("keyup", (event) => {
    handleArrowKeyPress(event, tabPanelLabelIndex, allToggleAccordionText);
    handleHomeAndEndKeyPress(event, allToggleAccordionText);
  });
});
window.onload = () => handleLogoImageAltText();
window.onclick = function (event) {
  if (event.target == overlay) {
    if (menuList.classList.contains("menu-list--active")) {
      closeMenu();
      overlay.classList.add(HIDDEN_CLASS);
    }
    if (notificationWindow.classList.contains("alert-pop-up--active")) {
      closeNotification();
      overlay.classList.add(HIDDEN_CLASS);
    }
  }
};

const debouncedResizeHandler = debounce(handleLogoImageAltText, 1000);

window.addEventListener("resize", debouncedResizeHandler);

function debounce(callback, delay) {
  let timeout;

  return (...args) => {
    clearTimeout(timeout);

    timeout = setTimeout(() => {
      callback(...args);
    }, delay);
  };
}

function handleLogoImageAltText() {
  if (window.innerWidth > 900) {
    shopifyLogo.setAttribute(
      "alt",
      "A shopping bag featuring a prominent letter 'S' and the word 'Shopify' indicating the shopify logo"
    );
  } else {
    shopifyLogo.setAttribute(
      "alt",
      "A shopping bag featuring a prominent letter 'S' indicating the shopify logo"
    );
  }
}

function toggleNotifications() {
  // use case: when menu popup is open and user click on
  // the the notification button, this should make the menu
  // popup close automatically
  if (menuBtn.getAttribute("aria-expanded") === "true") {
    closeMenu();
  }

  let isNotificationOpen =
    notificationBtn.attributes["aria-expanded"].value === "false";

  if (isNotificationOpen) {
    notificationWindow.classList.add("alert-pop-up--active");
    notificationBtn.classList.add("nav-bar__notification-btn--active");
    overlay.classList.remove(HIDDEN_CLASS);

    noticationWindowMenuItems.item(0).focus();

    notificationBtn.setAttribute("aria-expanded", true);

    notificationWindow.addEventListener("keyup", (event) => {
      handleEscapeKeyPress(event, () => {
        closeNotification();
        notificationBtn.focus();
      });
    });
  } else {
    closeNotification();
  }
}

function toggleMenu() {
  // use case: when notification popup is open and user click on
  // the the menu button, this should make the notification
  // dialog close automatically
  if (notificationBtn.getAttribute("aria-expanded") === "true") {
    closeNotification();
  }

  let isMenuOpen = menuBtn.attributes["aria-expanded"].value === "false";

  if (isMenuOpen) {
    menuList.classList.add("menu-list--active");
    menuBtn.classList.add("nav-bar__menu-btn--active");
    overlay.classList.remove(HIDDEN_CLASS);

    menuListItems.item(0).focus();

    menuBtn.setAttribute("aria-expanded", true);

    menuList.addEventListener("keyup", (event) => {
      handleEscapeKeyPress(event, () => {
        closeMenu();
        menuBtn.focus();
      });
    });
  } else {
    closeMenu();
  }
}

function closeMenu() {
  menuList.classList.remove("menu-list--active");
  menuBtn.classList.remove("nav-bar__menu-btn--active");
  menuBtn.setAttribute("aria-expanded", false);
}

function closeNotification() {
  notificationWindow.classList.remove("alert-pop-up--active");
  notificationBtn.classList.remove("nav-bar__notification-btn--active");
  notificationBtn.setAttribute("aria-expanded", false);
}

function closePlanBanner() {
  planBanner.style.visibility = "hidden";
}

function toggleCollapsibleSection() {
  let isCollapsibleContainerOpen =
    collapsibleBtn.attributes["aria-expanded"].value === "false";

  if (isCollapsibleContainerOpen) {
    collapsibleBtn.setAttribute("aria-expanded", true);
    collapsibleBtn.children[0].style.transform = "rotate(-180deg)";

    collapsibleContainer.style.display = "block";
    collapsibleContainer.previousElementSibling.classList.add(
      "setup-guide--active"
    );
  } else {
    collapsibleBtn.setAttribute("aria-expanded", false);
    collapsibleBtn.children[0].style.transform = "rotate(0deg)";

    collapsibleContainer.style.display = "none";
    collapsibleContainer.previousElementSibling.classList.remove(
      "setup-guide--active"
    );
  }
}

function toggleAccordion() {
  const setupToggleText = this.getAttribute("aria-selected");

  for (let i = 0; i < allToggleAccordionText.length; i++) {
    allToggleAccordionText[i].setAttribute("aria-Selected", "false");
    allToggleAccordionText[i].parentNode.parentNode.classList.remove(
      "setup-steps__item--active"
    );
  }
  if (setupToggleText == "false") {
    this.setAttribute("aria-selected", "true");
    this.parentNode.parentNode.classList.add("setup-steps__item--active");
  }
}

function toggleChecked(checkboxBtn) {
  const isChecked = checkboxBtn.classList.contains(CHECKED_CLASS);

  const unCheckedSvg = checkboxBtn.children[0];
  const checkedSvg = checkboxBtn.children[1];
  const loadingSpinnerSvg = checkboxBtn.children[2];
  const inputCheckbox = checkboxBtn.children[3];

  const nextSetupGuideElement =
    checkboxBtn.parentNode.parentNode.nextElementSibling;
  const nextSetupGuideLabelElement =
    nextSetupGuideElement && nextSetupGuideElement.children[0].children[2];

  if (isChecked) {
    setupUnchecked(unCheckedSvg, loadingSpinnerSvg, checkedSvg, checkboxBtn);

    inputCheckbox.checked = false;

    completed--;
  } else {
    setupChecked(unCheckedSvg, loadingSpinnerSvg, checkedSvg, checkboxBtn);

    inputCheckbox.checked = true;

    for (let i = 0; i < allToggleAccordionText.length; i++) {
      allToggleAccordionText[i].setAttribute("aria-selected", "false");
      allToggleAccordionText[i].parentNode.parentNode.classList.remove(
        "setup-steps__item--active"
      );
    }
    if (nextSetupGuideLabelElement !== null) {
      nextSetupGuideLabelElement.setAttribute("aria-selected", "true");
      nextSetupGuideElement.classList.add("setup-steps__item--active");
    }
    completed++;
  }

  progressText.innerText = `${completed} / 5 completed`;
  progressBarFilledLine.style.width = `${20 * completed}%`;
}

function setupChecked(
  notCompletedIcon,
  loadingSpinnerIcon,
  checkedIcon,
  currentCheckbox
) {
  const checkboxBtnStatus = currentCheckbox.previousElementSibling;

  notCompletedIcon.classList.add(HIDDEN_CLASS);
  loadingSpinnerIcon.classList.remove(HIDDEN_CLASS);

  checkboxBtnStatus.ariaLabel = "Loading. Please wait";

  setTimeout(() => {
    loadingSpinnerIcon.classList.add(HIDDEN_CLASS);
    checkedIcon.classList.remove(HIDDEN_CLASS);

    checkboxBtnStatus.ariaLabel = `Successfully ${currentCheckbox.ariaLabel}`;

    currentCheckbox.ariaLabel = currentCheckbox.ariaLabel.replace(
      "as completed",
      "as not completed"
    );

    currentCheckbox.setAttribute("aria-checked", "true");
    currentCheckbox.classList.add(CHECKED_CLASS);
  }, 500);
}

function setupUnchecked(
  notCompletedIcon,
  loadingSpinnerIcon,
  checkedIcon,
  currentCheckbox
) {
  const checkboxBtnStatus = currentCheckbox.previousElementSibling;

  checkedIcon.classList.add("hidden");
  loadingSpinnerIcon.classList.remove("hidden");

  setTimeout(() => {
    loadingSpinnerIcon.classList.add("hidden");
    notCompletedIcon.classList.remove("hidden");

    checkboxBtnStatus.ariaLabel = `Successfully ${currentCheckbox.ariaLabel}`;

    currentCheckbox.ariaLabel = currentCheckbox.ariaLabel.replace(
      "as not completed",
      "as completed"
    );

    currentCheckbox.setAttribute("aria-checked", "false");
    currentCheckbox.classList.remove(CHECKED_CLASS);
  }, 500);
}

function handleEscapeKeyPress(e, callback) {
  if (e.key === "Escape") {
    callback();
  }
}

function handleArrowKeyPress(event, elementIndex, allElements) {
  event.key;
  const isLastElement = elementIndex === allElements.length - 1;
  const isFirstElement = elementIndex === 0;

  const nextElementIndex = allElements.item(elementIndex + 1);
  const previousElementIndex = allElements.item(elementIndex - 1);

  if (event.key === "ArrowRight" || event.key === "ArrowDown") {
    if (isLastElement) return allElements.item(0).focus();

    nextElementIndex.focus();
  }

  if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
    if (isFirstElement) return allElements.item(allElements.length - 1).focus();

    previousElementIndex.focus();
  }
}

function handleHomeAndEndKeyPress(event, allElements) {
  const firstElement = allElements.item(0);
  const lastElement = allElements.item(allElements.length - 1);

  if (event.key === "Home") {
    firstElement.focus();
  }

  if (event.key === "End") {
    lastElement.focus();
  }
}
//move focus to the next element
function handleEnterandSpaceKeyPress(event, elementIndex, allElements) {
  if (elementIndex == allElements.length - 1) return;

  const nextElement = allElements.item(elementIndex + 1);

  if (event.key == "Enter" || event.keyCode == 32) {
    nextElement.focus();
  }
}
