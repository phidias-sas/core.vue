<template>
	<div id="state-billing-debits" class="phi-page">
		<div class="phi-page-cover">
			<div class="phi-page-toolbar">
				<button class="phi-button" @click="$parent.$el.left.toggle()"> <i class="fa fa-bars"></i></button>
				<h1>{{ $t("Billing") }}</h1>
			</div>
		</div>

		<!-- Loading is true -->
		<mu-linear-progress color="#1c89b8" v-show="isLoading" />


		<!-- Loadingset is false -->
		<div class="phi-page-contents" v-if="!isLoading">
			<section>
				<h2>Cobros pendientes</h2>
				<div class="types phi-card _z-0">
					<ul class="list">
						<li v-for="pending in pendings">
							<router-link :to="{name: 'billing-debit-debitId', params:{debitId: pending.id}}">
								<div class="col info">
									<p><b>{{pending.period.name}} <small>#{{pending.sequence}}</small></b></p>
									<p class="dato"><span class="fa fa-clock-o"></span> {{pending.expiration_date|moment.format}}</p>
									<p class="dato"><span class="fa fa-user-o"></span> {{pending.person.firstname}}</p>
								</div>
								<div class="col balance" align="right">
									<b>{{pending.balance|currency}}</b> <br>
									<span class="interest"><span class="fa fa-warning" v-if="pending.interests"></span> {{pending.interests ? pending.interests.value : ''|currency}}</span>
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
			isLoading:   true,
		}
	},

	mounted(){
		app.api.get(`v3/people/${app.user.id}/billing/debits/pending`)
			.then(datos => {
				this.pendings  = datos;
				this.isLoading = !datos;
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
					
					.col {
						flex-grow: 1;
						.dato {
							color: #666;
							margin: 5px;
							font-size: 13px;
							margin-left: 15px;
						}
						.interest {
							color:red;
							font-size: 11px;
							background: #f2f2f2;
						}
						.fa-clock-o {
							color: #3F51B5;
						}
						.fa-user-o {
							color: #009688;
						}
					}

					.balance {
						color: green;
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
}

</style>