<script>
	import Router from 'svelte-spa-router';
	
	import NotFound from "./pages/NotFound.svelte";
	import Home from "./pages/Home.svelte";
	import Info from "./pages/Info.svelte";
	import Education_Expenditures from "./front/education_expenditures/App.svelte";
	import illiteracy from "./front/illiteracy/illiteracyApp.svelte";
	import illiteracy_edit from "./front/illiteracy/Edit_Tables.svelte";
	
	const routes = {
		"/":Home,
		"/info":Info,
		'*': NotFound,
		"/education_expenditures":Education_Expenditures,
		"/illiteracy":illiteracy,
		"/illiteracy/:country/:date":illiteracy_edit
		};




</script>

<main>
	<Router {routes}> </Router>
</main>

<style>
</style>