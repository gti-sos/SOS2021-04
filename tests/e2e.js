const puppeteer = require('puppeteer');
const screenshotPath_illiteracy = './tests/e2e_capturas/miggomvaz/';
const screenshotPath_povertyrisks = "./tests/e2e_capturas/javcarand1/e2e/";
const screenshotPath_edex = './tests/e2e_capturas/mangonreg/';

(async () => {
  const browser = await puppeteer.launch({
    headless: true, // Especificamos que el navegador no es headless
    slowMo: 1000, // Añadimos un delay de 1 segundo entre cada comando.
  });

  const context = await browser.createIncognitoBrowserContext();
  const page = await browser.newPage();
  await page.setViewport({ width: 3688, height: 1768 });
  //Home
  //https://sos2021-04.herokuapp.com
  await page.goto('http://localhost:10000/', { waitUntil: 'networkidle2' });

  //Capturas pantalla inicial

  await page.screenshot({ path: screenshotPath_illiteracy + 'HOME_0.png' });
  await page.screenshot({ path: screenshotPath_edex + 'HOME_0.png' });
 
  //illiteracy
  await page.screenshot({ path: screenshotPath_illiteracy + 'ILLI_14_edit_illiteracy_stat_1.png' });
  console.log("--Home press interface button to go to illiteracy-stats view--")
  await Promise.all([
    page.waitForNavigation(),
    page.click("body > main > main > div:nth-child(16) > div:nth-child(3) > div > div.card-body > a:nth-child(4) > button"),
  ]);

  await page.screenshot({ path: screenshotPath_illiteracy + 'ILLI_0_front_0.png' });

  console.log("illiteracy press load button.....")

  await page.click("#cargarDatos");
  await page.screenshot({ path: screenshotPath_illiteracy + 'ILLI_1_front_load_1.png' });

  console.log("--illiteracy go to next page--");
  await page.click("#pagination_forward");
  await page.screenshot({ path: screenshotPath_illiteracy + 'ILLI_4_front_2.png' });

  console.log("--illiteracy go to previous page--");
  await page.click("#pagination_back");
  await page.screenshot({ path: screenshotPath_illiteracy + 'ILLI_5_front_3.png' });


  await page.screenshot({ path: screenshotPath_illiteracy + 'ILLI_7_analytics2_0.png' });



  console.log("illiteracy insert new stat.....");
  await page.focus('#insert_input_country');
  await page.keyboard.type("Swizterland");

  await page.focus('#insert_input_year');
  await page.keyboard.type("2019");

  await page.focus('#insert_female');
  await page.keyboard.type("22");

  await page.focus('#insert_male');
  await page.keyboard.type("22");

  await page.focus('#insert_adult');
  await page.keyboard.type("22");

  await page.focus('#insert_young');
  await page.keyboard.type("22");

  await page.screenshot({ path: screenshotPath_illiteracy + 'ILLI_9_front_insert_0.png' });

  await page.focus('#insert_button');
  await page.click("#insert_button");
  await page.waitForSelector('#insert_button', { visible: true });
  await page.screenshot({ path: screenshotPath_illiteracy + 'ILLI_10_front_insert_1.png' });
  console.log(".....illiteracy stat inserted");


  console.log("illiteracy search the new stat.....");
  await page.focus('#query_input_country');
  await page.keyboard.type("Spain");
  await page.focus('#query_input_date');
  await page.keyboard.type("2014");
  await page.screenshot({ path: screenshotPath_illiteracy + 'ILLI_11_front_search_0.png' });
  await page.focus('#query_button');
  await page.click("#query_button");
  await page.waitForSelector('#query_button', { visible: true });
  await page.screenshot({ path: screenshotPath_illiteracy + 'ILLI_12_front_search_1.png' });
  console.log(".....illiteracy stat searched");

  console.log("--illiteracy press Spain edit button => edit stat view--");

  await Promise.all([
    page.waitForNavigation(),
    page.click("#edit_button_Spain_2014"),
    page.waitForSelector('#edit_button_Spain_2014', { visible: true }),
  ]);
  await page.screenshot({ path: screenshotPath_illiteracy + 'ILLI_13_edit_illiteracy_stat_0.png' });
/*
  console.log("illiteracy update Spain_2014 .....");
  await page.focus('#input_update_woman');
  await page.$eval("#input_update_woman", el => el.value = "");
  await page.keyboard.type("0");
  await page.screenshot({ path: screenshotPath_illiteracy + 'ILLI_14_edit_illiteracy_stat_1.png' });
  await page.focus('#input_update_button');
  await page.click("#input_update_button");
  await page.waitForSelector('#input_update_button', { visible: true }),
    await page.screenshot({ path: screenshotPath_illiteracy + 'ILLI_15_edit_illiteracy_stat_2.png' });
  console.log(".....Spain 2014 updated");

  console.log("--edit press back to interface button => illiteracy interface--");
  await Promise.all([
    page.waitForNavigation(),
    page.click("#nav_return"),
  ]);
  await page.waitForTimeout(2000);
  await page.screenshot({ path: screenshotPath_illiteracy + 'ILLI_16_front_stat_updated_0.png' });

  console.log("illiteracy search the updated stat.....");
  await page.focus('#query_input_country');
  await page.keyboard.type("Spain");
  await page.focus('#query_input_date');
  await page.keyboard.type("2014");
  await page.screenshot({ path: screenshotPath_illiteracy + 'ILLI_17_front_search_3.png' });
  await page.focus('#query_button');
  await page.click("#query_button");
  await page.waitForSelector('#query_button', { visible: true });
  await page.screenshot({ path: screenshotPath_illiteracy + 'ILLI_18_front_search_4.png' });
  console.log(".....illiteracy stat searched");

  console.log("--illiteracy press Spain_2014 delete button--"); 

  await  page.click("#delete_button_Spain_2014"),
  await page.waitForTimeout(1000);
  
  await page.screenshot({ path: screenshotPath_illiteracy + 'ILLI_19_front_deleted_illiteracy_stat_0.png' });

  console.log("illiteracy press delete all button.....")
  await page.click("#delete_all");
  await page.screenshot({ path: screenshotPath_illiteracy + 'ILLI_21_front_delete_1.png' });

  console.log(".....delete all complete")
  await page.screenshot({ path: screenshotPath_illiteracy + 'ILLI_22_front_5.png' });

  console.log("--interface press back to home button => home--");
  await Promise.all([
    page.waitForNavigation(),
    page.click("#nav_home"),
  ]);
*/
  await page.screenshot({ path: screenshotPath_illiteracy + 'HOME_1.png' });

  await page.close();
  await browser.close();

  
  //Education Expenditures

  //Volvemos a la página principal

  const browser_edex = await puppeteer.launch({
    headless: true, // Especificamos que el navegador no es headless
    slowMo: 1000, // Añadimos un delay de 1 segundo entre cada comando.
  });
  const page_edex = await browser_edex.newPage();
  await page_edex.setViewport({ width: 3688, height: 1768 });
  page_edex.setDefaultTimeout(0);
  page_edex.setDefaultNavigationTimeout(0);

  await page_edex.goto('http://localhost:10000/', { waitUntil: 'networkidle2' });

  await Promise.all([
    page_edex.waitForNavigation(),
    //Accedemos a la interfaz de Education expenditures
    console.log("Accediendo a education expenditures"),
    page_edex.click("body > main > main > div:nth-child(16) > div:nth-child(1) > div > div.card-body > a:nth-child(4) > button")
  ]);

  //Eliminar datos cargados
  console.log("Se hace click en borrar datos");
  await page_edex.click("#borradatos");
  await page_edex.screenshot({ path: screenshotPath_edex + 'EE_front_Interf_0.png' });

  //Carga de datos
  console.log("Se hace click en cargar datos");
  await page_edex.click("#cargadatos");
  await page_edex.screenshot({ path: screenshotPath_edex + 'EE_front_Interf_1.png' });

  //Capturas sobre paginacion (hacia adelante/ hacia atrás)
  console.log("Cambiar página (paginación) hacia adelante");
  await page_edex.click("#paginacion_siguiente");
  await page_edex.screenshot({ path: screenshotPath_edex + 'EE_front_Interf_2.png' });

  console.log("Cambiar página (paginación) hacia detrás");
  await page_edex.click("#paginacion_atras");
  await page_edex.screenshot({ path: screenshotPath_edex + 'EE_front_Interf_3.png' });

  //Insertar un nuevo dato

  console.log("Acceso a introducción de un nuevo dato");
  await page_edex.focus('#input_pais');
  await page_edex.keyboard.type("Argentina");

  await page_edex.focus('#input_anyo');
  await page_edex.keyboard.type("2017");

  await page_edex.focus('#input_permillions');
  await page_edex.keyboard.type("31069.00");

  await page_edex.focus('#input_perpublic');
  await page_edex.keyboard.type("13.26");

  await page_edex.focus('#input_gdp');
  await page_edex.keyboard.type("5.46");

  await page_edex.focus('#input_percapita');
  await page_edex.keyboard.type("705.00");

  await page_edex.screenshot({ path: screenshotPath_edex + 'EE_front_insert_0.png' });

  await page_edex.focus('#inserta');
  await page_edex.click("#inserta");
  await page_edex.waitForSelector('#inserta', { visible: true });
  await page_edex.screenshot({ path: screenshotPath_edex + 'EE_front_insert_1.png' });
  console.log("Dato insertado en edex");

  //Acceso a editar un stat

  console.log("Editando un stat");

  await Promise.all([
    page_edex.waitForNavigation(),
    //Accedemos a la interfaz de Education expenditures
    page_edex.click("body > main > main > div:nth-child(2) > main > div:nth-child(3) > table:nth-child(2) > tbody > tr:nth-child(2) > th:nth-child(8) > a > button"),
  ]);

  await page_edex.focus('#edit_gdp');
  await page_edex.keyboard.type('12.6');

  await page_edex.screenshot({ path: screenshotPath_edex + 'EE_front_Edit_0.png' });

  //Volvemos a la pagina principal
  await Promise.all([
    page_edex.waitForNavigation(),
    
    page_edex.click("body > main > main > div.foot.svelte-1eplfbf > footer > div > a > button"),
  ]);

  await page_edex.screenshot({ path: screenshotPath_edex + 'EE_front_Edit_1.png' });

  //Eliminamos el primer elemento
  console.log("Eliminando un stat");
  await page_edex.click("body > main > main > div:nth-child(2) > main > div:nth-child(3) > table:nth-child(2) > tbody > tr:nth-child(2) > th:nth-child(7) > button"),
  await page_edex.screenshot({ path: screenshotPath_edex + 'EE_front_DeleteElement_0.png' });

  //Búsqueda
  console.log("Acceso a búsqueda");
  await page_edex.focus('#input_b_millones_min');
  await page_edex.keyboard.type("100000.0");

  await page_edex.focus('#input_b_gastoPublico_max');
  await page_edex.keyboard.type("9.5");

  await page_edex.screenshot({ path: screenshotPath_edex + 'EE_front_Search_0.png' });

  console.log("Buscando stats");
  await page_edex.click("body > main > main > div:nth-child(2) > main > div:nth-child(3) > table:nth-child(1) > tbody > tr > td:nth-child(7) > button"),
  await page_edex.screenshot({ path: screenshotPath_edex + 'EE_front_Search_1.png' });

  //Restauramos la busqueda y volvemos a borrar y cargar datos

  await page_edex.click("body > main > main > div:nth-child(2) > main > div:nth-child(3) > table:nth-child(1) > tbody > tr > td:nth-child(8) > button"),
  
  await page_edex.click("#borradatos");
  await page_edex.click("#cargadatos");

  await page_edex.close();
  await browser_edex.close();


// ------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------

  const browser_povertyrisks = await puppeteer.launch({
    headless: true, // Especificamos que el navegador es headless, se ejecuta sin interfaz gráfica
    slowMo: 1000, // Añadimos un delay de 1 segundo entre cada comando.
  });
  const context_povertyrisks = await browser_povertyrisks.createIncognitoBrowserContext();
  const page_povertyrisks = await browser_povertyrisks.newPage();
  await page_povertyrisks.setViewport({ width: 3688, height: 1768 });
  //Home
  //https://sos2021-04.herokuapp.com
  await page_povertyrisks.goto('http://localhost:10000/', { waitUntil: 'networkidle2' });

  await page_povertyrisks.screenshot({ path: screenshotPath_povertyrisks + '0_PR_front_Home.png' });

  //povertyrisks
  console.log("--Home press interface button to go to povertyrisks-stats view--")
  await Promise.all([
    page_povertyrisks.waitForNavigation(),
    page_povertyrisks.click("body > main > main > div:nth-child(16) > div:nth-child(2) > div > div.card-body > a:nth-child(4) > button"),
  ]);

  await page_povertyrisks.screenshot({ path: screenshotPath_povertyrisks + '1_PR_front_noData.png' });

  console.log("povertyrisks press load button.....")

  await page_povertyrisks.click("body > main > main > div:nth-child(2) > main > div:nth-child(1) > div:nth-child(1) > div > button:nth-child(1)");
  await page_povertyrisks.screenshot({ path: screenshotPath_povertyrisks + '2_PR_front_withData.png' });


  console.log("povertyrisks insert new stat.....");
  await page_povertyrisks.focus('body > main > main > div:nth-child(2) > main > table:nth-child(6) > tbody > tr:nth-child(1) > td:nth-child(1) > input[type=number]');
  await page_povertyrisks.keyboard.type("2019");

  await page_povertyrisks.focus('body > main > main > div:nth-child(2) > main > table:nth-child(6) > tbody > tr:nth-child(1) > td:nth-child(2) > input[type=text]');
  await page_povertyrisks.keyboard.type("Swizterland");

  await page_povertyrisks.focus('body > main > main > div:nth-child(2) > main > table:nth-child(6) > tbody > tr:nth-child(1) > td:nth-child(3) > input[type=number]');
  await page_povertyrisks.keyboard.type("22");

  await page_povertyrisks.focus('body > main > main > div:nth-child(2) > main > table:nth-child(6) > tbody > tr:nth-child(1) > td:nth-child(4) > input[type=number]');
  await page_povertyrisks.keyboard.type("22");

  await page_povertyrisks.focus('body > main > main > div:nth-child(2) > main > table:nth-child(6) > tbody > tr:nth-child(1) > td:nth-child(5) > input[type=number]');
  await page_povertyrisks.keyboard.type("22");

  await page_povertyrisks.focus('body > main > main > div:nth-child(2) > main > table:nth-child(6) > tbody > tr:nth-child(1) > td:nth-child(6) > input[type=number]');
  await page_povertyrisks.keyboard.type("22");

  await page_povertyrisks.screenshot({ path: screenshotPath_povertyrisks + '3_PR_front_beforeInsertData.png' });

  await page_povertyrisks.focus('body > main > main > div:nth-child(2) > main > table:nth-child(6) > tbody > tr:nth-child(1) > td:nth-child(7) > button');
  await page_povertyrisks.click("body > main > main > div:nth-child(2) > main > table:nth-child(6) > tbody > tr:nth-child(1) > td:nth-child(7) > button");
  await page_povertyrisks.waitForSelector('body > main > main > div:nth-child(2) > main > table:nth-child(6) > tbody > tr:nth-child(1) > td:nth-child(7) > button', { visible: true });
  await page_povertyrisks.screenshot({ path: screenshotPath_povertyrisks + '4_PR_front_afterInsertData.png' });
  console.log(".....povertyrisks stat inserted");


  console.log("povertyrisks search the new stat.....");
  await page_povertyrisks.focus('body > main > main > div:nth-child(2) > main > table:nth-child(4) > tbody > tr > td:nth-child(1) > input[type=number]');
  await page_povertyrisks.keyboard.type("2019");
  await page_povertyrisks.focus('body > main > main > div:nth-child(2) > main > table:nth-child(4) > tbody > tr > td:nth-child(2) > input[type=text]');
  await page_povertyrisks.keyboard.type("Swizterland");
  await page_povertyrisks.screenshot({ path: screenshotPath_povertyrisks + '5_PR_front_beforeSearchData.png' });
  await page_povertyrisks.focus('body > main > main > div:nth-child(2) > main > table:nth-child(4) > tbody > tr > td:nth-child(7) > button');
  await page_povertyrisks.click("body > main > main > div:nth-child(2) > main > table:nth-child(4) > tbody > tr > td:nth-child(7) > button");
  await page_povertyrisks.waitForSelector('body > main > main > div:nth-child(2) > main > table:nth-child(4) > tbody > tr > td:nth-child(7) > button', { visible: true });
  await page_povertyrisks.screenshot({ path: screenshotPath_povertyrisks + '6_PR_front_afterSearchData.png' });
  console.log(".....povertyrisks stat searched");
  //Resetea la búsqueda
  await page_povertyrisks.click("body > main > main > div:nth-child(2) > main > table:nth-child(4) > tbody > tr > td:nth-child(8) > button");

  console.log("povertyrisks press delete all button.....")
  await page_povertyrisks.click("body > main > main > div:nth-child(2) > main > div > div:nth-child(1) > div > button:nth-child(2)");
  await page_povertyrisks.screenshot({ path: screenshotPath_povertyrisks + '7_PR_front_deleteAll.png' });

  await page_povertyrisks.close();
  await browser_povertyrisks.close();
  process.exit(0);
})();