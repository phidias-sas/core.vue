<template>
	<div id="state-billing-debits" class="phi-page">
		<div class="phi-page-cover">
			<div class="phi-page-toolbar">
				<button class="phi-button" @click="$parent.$el.left.toggle()"> <i class="fa fa-bars"></i></button>
				<h1>Consolidado de tesorería</h1>
			</div>
		</div>

		<!-- Loading is true -->
		<div v-if="loading" class="loading">
			<i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i>
		</div>

		<!-- Loadingset is false -->
		<div class="phi-page-contents" v-if="!loading">
			<section>
				<h2>Cobros pendientes</h2>
				<div class="types phi-card _z-0">
					<ul class="list">
						<li v-for="pending in pendings">
							<router-link :to="{name: 'billing-debit-debitId', params:{debitId: pending.id}}">
								<div class="info">
									<p><b>{{pending.period.name}} <small>#{{pending.sequence}}</small></b></p>
									<p class="dato"><span class="fa fa-clock-o"></span> {{pending.expiration_date|moment.format}}</p>
									<p class="dato"><span class="fa fa-user-o"></span> {{pending.person.firstname}}</p>
								</div>
								<div class="balance">
									{{pending.balance}} <br>
									<span class="interest"><span class="fa fa-warning" v-show="pending.interests"></span> {{pending.interests ? pending.interests.value : ''}}</span>
								</div>
							</router-link>
						</li>
					</ul>
				</div>
			</section>
		</div>

	</div>
</template>

<script>
import app from '../../store/app.js';

export default{
	data() {
		return {
			pendings:  [],
			interests: [],
			loading:   true,
		}
	},

	mounted(){
		app.api.get(`v3/people/${app.user.id}/billing/debits/pending`)
			.then(datos => {
				if (datos) {
					this.loading  = false;
					this.pendings = datos;
				} else {
					this.loading = true;
				}
			});
	}
}
</script>

<style lang="scss" scoped>

#state-billing-debits{
	section {
		h2 {
			color: #666;
			font-size: 0.8em;
			font-weight: 1em;
			margin-bottom: 0.5em;
			text-transform: uppercase;
		}
		.list {
			margin: 0;
			padding: 0;
			border: 0;
			list-style: none;

			li {
				border-bottom: 1px dashed #ccc;

				a {
					padding: 8px;
					display: flex;
					flex-wrap: wrap;
					flex-direction: row;
					transition: all 0.2s ease;

					.info {
						flex-grow: 1;

						.dato {
							color: #666;
							margin: 5px;
							font-size: 13px;
							margin-left: 15px;
						}
					}

					.balance {
						flex-grow: 1;
						color: green;
						font-weight: bold;
						text-align: right;

						.interest {
							color:red;
							font-size: 11px;
							background: #f2f2f2;
						}
					}
				}
			}

			li:nth-last-child(1) {
				border-bottom: none;
			}

			li:hover {
				background: #F5F5F5;
			}
		}
	}

	.loading{
		width: 100%;
		font-size: 15px;
		margin-top: 15px;
		text-align: center;
	}
}

</style>