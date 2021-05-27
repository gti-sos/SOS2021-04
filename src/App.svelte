<script>
	import Router from 'svelte-spa-router';
	
	import NotFound from "./pages/NotFound.svelte";
	import Home from "./pages/Home.svelte";
	import Info from "./pages/Info.svelte";
	import Integrations from "./pages/Integraciones.svelte";
	
	
	import App_edex from "./front/education_expenditures/App_edex.svelte";
	import Edit_data_edex from "./front/education_expenditures/Edit_data_edex.svelte";
	import Edex_Graphs from "./front/education_expenditures/Edex_Graph.svelte";
	
	
	import illiteracy from "./front/illiteracy/illiteracyApp.svelte";
	import illiteracy_edit from "./front/illiteracy/edit_data_illiteracy.svelte";
	import illiteracy_Graphs from "./front/illiteracy/illiteracy_Graphs.svelte";
	import api1 from "./front/illiteracy/Integraciones/api1.svelte";
	import api2 from "./front/illiteracy/Integraciones/api2.svelte";
	
	import AppPovertyRisks from './front/poverty_risks/appPovertyRisks.svelte';
	import editData_poverty_risks from "./front/poverty_risks/editData_poverty_risks.svelte";
	import povertyRisks_Graphs from "./front/poverty_risks/povertyRisks_Graphs.svelte";
	import povertyRisks_natalityStats from "./front/poverty_risks/povertyRisks_natalityStats.svelte";
	import povertyRisks_drugUse from "./front/poverty_risks/povertyRisks_drugUse.svelte";

	import GraficasConjunto from './pages/GraficasConjunto.svelte';
	
	const routes = {
		"/":Home,
		"/info":Info,
		"/graphics":GraficasConjunto,
		"/integrations": Integrations,
		"/integrations/api1": api1,
		"/integrations/api2": api2,
		
		"/education_expenditures":App_edex,
		"/education_expenditures/:country/:year": Edit_data_edex,
		"/edex_graphs" : Edex_Graphs,
		
		"/illiteracy":illiteracy,
		"/illiteracy/:country/:date":illiteracy_edit,
		"/illiteracy_graphs" : illiteracy_Graphs,

		
		"/poverty_risks":AppPovertyRisks,
		"/poverty_risks/:country/:year": editData_poverty_risks,
		"/povertyrisks_graphs" : povertyRisks_Graphs,
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