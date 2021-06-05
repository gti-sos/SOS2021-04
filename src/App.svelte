<script>
	import Router from 'svelte-spa-router';
	
	import NotFound from "./pages/NotFound.svelte";
	import Home from "./pages/Home.svelte";
	import Info from "./pages/Info.svelte";
	import Analytics from "./pages/Analytics.svelte";
	import About from "./pages/About.svelte";
	import Integrations from "./pages/Integraciones.svelte";
	
	
	import App_edex from "./front/education_expenditures/App_edex.svelte";
	import Edit_data_edex from "./front/education_expenditures/Edit_data_edex.svelte";
	import Edex_Graphs from "./front/education_expenditures/Edex_Graph.svelte";
	import Edex_Graphs2 from "./front/education_expenditures/Edex_Graphs2.svelte";
	import Edex_research from "./front/education_expenditures/integraciones/Edex_api20.svelte";
	import Edex_sanity from "./front/education_expenditures/integraciones/Edex_apiSanity.svelte";
	import Edex_tourism from "./front/education_expenditures/integraciones/Edex_apiTourism.svelte";
	import Edex_external from "./front/education_expenditures/integraciones/Edex_externaColegiados.svelte";
	import Edex_external_pib from "./front/education_expenditures/integraciones/Edex_externaGastoID.svelte";

	
	
	import illiteracy from "./front/illiteracy/illiteracyApp.svelte";
	import illiteracy_edit from "./front/illiteracy/edit_data_illiteracy.svelte";
	import illiteracy_Graphs from "./front/illiteracy/illiteracy_Graphs.svelte";
	import illiteracy_Graphs2 from "./front/illiteracy/grafica-bib.svelte";
	import api1 from "./front/illiteracy/Integraciones/api1.svelte";
	import api2 from "./front/illiteracy/Integraciones/api2.svelte";
	import api3 from "./front/illiteracy/Integraciones/api3.svelte";
	import migObesity from "./front/illiteracy/Integraciones/mig-obesity-Stats.svelte";
	import migtemperature from "./front/illiteracy/Integraciones/mig-temperature.svelte";
	
	
	import AppPovertyRisks from './front/poverty_risks/appPovertyRisks.svelte';
	import editData_poverty_risks from "./front/poverty_risks/editData_poverty_risks.svelte";
	import povertyRisks_MyChartHighcharts from "./front/poverty_risks/povertyRisks_MyChartHighcharts.svelte";
	import povertyRisks_MyChartApexcharts from "./front/poverty_risks/povertyRisks_MyChartApexcharts.svelte";
	import povertyRisks_USO_ParqueMovil from "./front/poverty_risks/povertyRisks_USO_ParqueMovil.svelte";
	import povertyRisks_USO_Fisios from "./front/poverty_risks/povertyRisks_USO_Fisios.svelte";
	import povertyRisks_natalityStats from "./front/poverty_risks/povertyRisks_natalityStats.svelte";
	import povertyRisks_drugUse from "./front/poverty_risks/povertyRisks_drugUse.svelte";

	import GraficasConjunto from './pages/GraficasConjunto.svelte';
	
	const routes = {
		"/":Home,
		"/info":Info,
		"/integrations": Integrations,
		"/analytics": GraficasConjunto,
		"/about": About,
		
		
		"/education_expenditures":App_edex,
		"/education_expenditures/:country/:year": Edit_data_edex,
		"/edex_graphs" : Edex_Graphs,
		"/edex_graphs2" : Edex_Graphs2,
		"/integrations/edex/api1":Edex_research,
		"/integrations/edex/api2":Edex_sanity,
		"/integrations/edex/api3":Edex_tourism,
		"/integrations/edex/api4":Edex_external,
		"/integrations/edex/api5":Edex_external_pib,
		
		"/illiteracy":illiteracy,
		"/illiteracy/:country/:date":illiteracy_edit,
		"/illiteracy_graphs" : illiteracy_Graphs,
		"/illiteracy_graphs2" : illiteracy_Graphs2,
		"/integrations/api1": api1,
		"/integrations/api2": api2,
		"/integrations/api3": api3,
		"/integrations/mig-obesity-Stats": migObesity,
		"/integrations/mig-temperature": migtemperature,
		
		"/poverty_risks":AppPovertyRisks,
		"/poverty_risks/:country/:year": editData_poverty_risks,
		"/povertyrisks_MyChartHighcharts" : povertyRisks_MyChartHighcharts,
		"/povertyrisks_MyChartApexcharts" : povertyRisks_MyChartApexcharts,
		"/povertyRisks_USO_ParqueMovil" : povertyRisks_USO_ParqueMovil,
		"/povertyRisks_USO_Fisios" : povertyRisks_USO_Fisios,
		"/povertyrisks_natalityStats" : povertyRisks_natalityStats,
		"/povertyrisks_drugUse" : povertyRisks_drugUse,
		
		
		'*': NotFound //Debe ir la última o se ejecutará antes y la tomará como no encontrada
		
		};




</script>

<main>
	<Router {routes}> </Router>

	
</main>

<style>
</style>