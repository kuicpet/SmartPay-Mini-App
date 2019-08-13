const supportedCards = {
                    visa, mastercard
                };

                const countries = [
                    {
                    code: "US",
                    currency: "USD",
                    currencyName: '',
                    country: 'United States'
                    },
                    {
                    code: "NG",
                    currency: "NGN",
                    currencyName: '',
                    country: 'Nigeria'
                    },
                    {
                    code: 'KE',
                    currency: 'KES',
                    currencyName: '',
                    country: 'Kenya'
                    },
                    {
                    code: 'UG',
                    currency: 'UGX',
                    currencyName: '',
                    country: 'Uganda'
                    },
                    {
                    code: 'RW',
                    currency: 'RWF',
                    currencyName: '',
                    country: 'Rwanda'
                    },
                    {
                    code: 'TZ',
                    currency: 'TZS',
                    currencyName: '',
                    country: 'Tanzania'
                    },
                    {
                    code: 'ZA',
                    currency: 'ZAR',
                    currencyName: '',
                    country: 'South Africa'
                    },
                    {
                    code: 'CM',
                    currency: 'XAF',
                    currencyName: '',
                    country: 'Cameroon'
                    },
                    {
                    code: 'GH',
                    currency: 'GHS',
                    currencyName: '',
                    country: 'Ghana'
                    }
                ];

                const billHype = () => {
                    const billDisplay = document.querySelector('.mdc-typography--headline4');
                    if (!billDisplay) return;

                    billDisplay.addEventListener('click', () => {
                    const billSpan = document.querySelector("[data-bill]");
                    if (billSpan &&
                        appState.bill &&
                        appState.billFormatted &&
                        appState.billFormatted === billSpan.textContent) {
                        window.speechSynthesis.speak(
                        new SpeechSynthesisUtterance(appState.billFormatted)
                        );
                    }
                    });
                };

                //appState
                const appState = {};

                //smartCursor
                const smartCursor = (event, fieldIndex,fields) => {
                    if(fieldIndex === fields.length -1){
                        if(fields[fieldIndex].value.length === Number(fields[fieldIndex].size)){
                            fields[fieldIndex + 1].focus();
                        }
                    }
                };

                //smartInput
                const smartInput = (event, fieldIndex,fields) => {
                    if(fieldIndex <= 3){
                        let field = fields[fieldIndex];
                        if(event.key !== 'Backspace' && event.wgich !== 37 && event.which !== 9 && event.which !== 39){
                            event.preventDefault();
                        }
                        if(appState.cardDigits[fieldIndex] == undefined){
                            appState.cardDigits[fieldIndex] = [];
                        }
                        if(/^\d{1}$/.test(event.key)){
                            field.value = field.value + String(event.key);
                            appState.cardDigits[fieldIndex][field.value.length - 1] = Number(event.key);
                        }
                        if(event.key === 'Backspace'){
                            appState.cardDigits[fieldIndex][field.value.length - 1] = undefined;
                        }
                        if(fieldIndex < 3){
                            (() => {
                                setTimeout(()=>{
                                    field.value = 
                                    '#'.repeat(field.value.length);
                                    if(fieldIndex === 
                                    0 && field.value.length >= 4){
                                        const first4Digits = 
                                        appState.cardDigits[0]
                                        detectCardType(first4Digits);
                                    }
                                },500)
                            })();
                        }
                    }
                    
                };

                //enableSmartTyping
                const enableSmartTyping = () => {
                    const cardInputOne = document.querySelector('[data-cc-digits] input:nth-child(1)');
            const cardInputTwo = document.querySelector('[data-cc-digits] input:nth-child(2)');
            const cardInputThree = document.querySelector('[data-cc-digits] input:nth-child(3)');
            const cardInputFour = document.querySelector('[data-cc-digits] input:nth-child(4)');
                    const nameField = document.querySelector('[data-cc-info] input:nth-child(1)');
                    const dateField = document.querySelector('[data-cc-info] input:nth-child(2)');
                    const fields = [cardInputOne, cardInputTwo, cardInputThree, cardInputFour,nameField, dateField];
                fields.forEach((field,index,fields) => {
                    field.addEventListener('keydown',(event)=>{
                    smartInput(event, index, fields)	
                    });
                })	
                };

                //formatAsMoney
                const formatAsMoney = (amount, buyerCountry) => {
                    const findCurrency = ({country}) => country == buyerCountry;
                    let country = countries.find(findCurrency);
                    if(!country){
                        country = {
                            code: 'en-US',
                            currency: 'USD'
                        }
                    }
                    return amount.toLocaleString(`en-${country.code}`,{
                        style: 'currency',
                        currency: country.currency
                    });
                };

                //flagIfInvalid
                const flagIfInvalid =(field, isValid) => {
                    if(isValid === true){
                        console.log(field);
                        field.classList.remove('is-invalid');
                    } else{
                        field.classList.add('is-invalid');
                    }
                };

                //expiryDateFormatIsValid
                const expiryDateFormatIsValid = (field) => {
                    const presentDate = new Date();
                    let isValid;
                    if(!/^(0|1)?[0-9]\/[0-9]{2}$/.test(field.value)){
                        return false;
                    }
                    const {value} = field;
                    const usersMonth = parseInt(value.split('/')[0]);
                    const usersYear = parseInt('20' + value.split('/')[1]);
                    const usersCardExpiryDate = new Date(usersYear, usersMonth);
                    isValid = usersCardExpiryDate > presentDate;
                    return isValid;
                };

                //detectCardType
                const detectCardType = (first4Digits) => {
                    const firstDigit = first4Digits[0];
                    const cardType = firstDigit === 4 ? 'is-visa' : firstDigit === 5 ? 'is-mastercard' : '';
                    const creditCard = document.querySelector('[data-credit-card]');
                    const cardTypeElement = document.querySelector('[data-card-type]');
                    if(cardType === 'is-visa'){
                        creditCard.classList.add('is-visa');
                        creditCard.classList.remove('is-mastercard');
                        cardTypeElement.src = supportedCards.visa
                    } else if (cardType === 'is-mastercard'){
                        creditCard.classList.add('is-mastercard');
                        creditCard.classList.remove('is-visa');
                        cardTypeElement.src = supportedCards.mastercard;
                    } else {
                        creditCard.classList.remove('is-mastercard');
                        creditCard.classList.remove('is-visa');
                        cardTypeElement.src = 'https://placehold.it/120x60.png?text=Card';
                    }
                    return cardType;
                };

                //validateCardExpiryDate
                const validateCardExpiryDate = () => {
                    const dateInputElement = document.querySelector('[data-cc-info] input:nth-child(2)');
                    console.log(dateInputElement.value);
                    const isValid = expiryDateFormatIsValid(dateInputElement);
                    console.log(isValid);
                    flagIfInvalid(dateInputElement, isValid);
                    return isValid;
                };

                //validateCardHolderName
                const validateCardHolderName = () => {
                    const field = document.querySelector('[data-cc-info] input:nth-child(1)');
                    const { value } = field;
                    const isValid = /^([a-zA-Z]{3,})\s([a-zA-Z]{3,})$/.test(value);
                    flagIfInvalid(field, isValid);
                    return isValid;
                };

                //validateWithLuhn
                const validateWithLuhn = (digits) =>{
                    let value = digits.join('');
                    if(/[^0-9-\s]+/.test(value)) return false;
                    let nCheck = 0, nDigit = 0, bEven = false;
                    value = value.replace(/\D/g, '');
                    for(let n = value.length - 1;n >= 0;n--){
                        const cDigit = value.charAt(n);
                        let nDigit = parseInt(cDigit, 10);
                        if(bEven){
                            if((nDigit *= 2) > 9)
                            nDigit -= 9;
                        }
                        nCheck += nDigit;
                        bEven = !bEven;
                    }
                    return (nCheck % 10) == 0;
                };

                //validateCardNumber
                const validateCardNumber = () => {
                    const cardInputs = appState.cardDigits.flat();
                    const isValid = validateWithLuhn(cardInputs);
                    const creditCardField = document.querySelector('[data-cc-digits]');
                    if(isValid){
                        creditCardField.classList.remove('is-invalid');
                    }
                    else{
                        creditCardField.classList.add('is-invalid');
                    }
                    return isValid;
                };

                //validatePayment
                const validatePayment = () => {
                    validateCardNumber();
                    validateCardHolderName();
                    validateCardExpiryDate();
                };

                //acceptCardNumbers
                const acceptCardNumbers = (event, fieldIndex) => {};

                //uiCanInteract
                const uiCanInteract = () => {
                    const firstInputElement = document.querySelector('[data-cc-digits] > input:nth-child(1)');
                    firstInputElement.focus();
                    document.querySelector('[data-pay-btn]').addEventListener('click', validatePayment);
                    billHype();
                    enableSmartTyping();
                };

                //displayCartTotal
                const displayCartTotal = ({results}) => {
                    const [data] = results;
                    const {itemsInCart, buyerCountry} = data;
                    appState.items = itemsInCart;
                    appState.country = buyerCountry;
                    appState.bill = itemsInCart.reduce((total,{price,qty})=>{return total + (price*qty);},0)
                    appState.billFormatted = formatAsMoney(appState.bill, appState.country);
                    appState.textContent = appState.billFormatted;
                    document.querySelector('[data-bill]').innerHTML = appState.billFormatted;
                    appState.cardDigits = [];
                    uiCanInteract();
                };

                //fetchBill
                const fetchBill = () => {
                    const apiHost = 'https://randomapi.com/api';
                    const apiKey = '006b08a801d82d0c9824dcfdfdfa3b3c';
                    const apiEndpoint = `${apiHost}/${apiKey}`;
                    fetch(apiEndpoint)
                    .then((response)=>{return response.json();})
                    .then((data)=>{return displayCartTotal(data);})
                    .catch((error)=>{console.log(error);});
                };


                
                const startApp = () => {
                            fetchBill();
                };

                startApp();
