<script>
	import './styles.css';
</script>

<div class='app'>
	<header class='header'>
		<nav class='navbar'>
			<a class='navlink' href='/'><h1 class='title'>Hacker News - Svelte</h1></a>
			<a class='navlink' href='/newstories'>New</a>
			<a class='navlink' href='/beststories'>Best</a>
			<a class='navlink' href='/askstories'>Ask</a>
			<a class='navlink' href='/showstories'>Show</a>
			<a class='navlink' href='/jobstories'>Jobs</a>
		</nav>
	</header>

	<slot />

	<footer class='footer'>
		©{new Date().getFullYear()} Karsanda
		<a href='https://github.com/karsanda/monorepo/tree/main/apps/hackernews-svelte'>
			Hacker News - Svelte
		</a>
	</footer>
</div>

<style>
	.navbar {
		display: flex;
		align-items: center;
		line-height: 1em;
	}

	.navlink {
		color: var(--white);
		padding: 0 8px;
		font-weight: 400;
		height: 14px;
	}

	.title {
		color: var(--primary-color);
		font-size: 14px;
		margin-right: 10px;
		font-weight: 600;
	}

	.header {
		padding: 10px;
		background-color: var(--dark-bg);
	}

	.footer {
		border-top: 2px solid var(--primary-color);
		margin: 0 5px;
		padding: 10px 0;
		text-align: center;
		font-size: 11px;
	}

	@media only screen and (max-width: 400px) {
		.title {
			font-size: 14px;
		}

		.navlink {
			font-size: 12px;
			padding: 0 7px;
			height: 12px;
		}
	}

	@media only screen and (max-width: 360px) {
		.title {
			font-size: 13px;
			margin-right: 7px;
		}
	}
</style>
