const puppeteer = require('puppeteer');
const screenshotPath_illiteracy = './tests/e2e_capturas/miggomvaz';

(async () => {
  const browser = await puppeteer.launch({
    headless: true, // Especificamos que el navegador no es headless
    slowMo: 1000, // Añadimos un delay de 1 segundo entre cada comando.
  });
  const context = await browser.createIncognitoBrowserContext();
  const page = await browser.newPage();
  await page.setViewport({ width: 3688, height: 1768 });
  //Home
  //https://sos2021-01.herokuapp.com
  await page.goto('http://localhost:10000/', { waitUntil: 'networkidle2' });

  await page.screenshot({ path: screenshotPath_illiteracy + 'HOME_0.png' });

  //illiteracy
  await page.screenshot({ path: screenshotPath_illiteracy + 'ILLI_14_edit_illiteracy_stat_1.png' });
  console.log("--Home press interface button to go to illiteracy-stats view--")
  await Promise.all([
    page.waitForNavigation(),
    page.click("body > main > main > div:nth-child(14) > div:nth-child(3) > div > div.card-body > a:nth-child(4) > button"),
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

  await page.screenshot({ path: screenshotPath_illiteracy + 'HOME_1.png' });




  await page.close();
  await browser.close();
})();