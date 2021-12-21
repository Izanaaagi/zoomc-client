import { Module, Mutation, VuexModule } from 'vuex-module-decorators';
import { Error } from '@/interfaces/error';


@Module({ namespaced: true, name: 'Errors' })
export class Errors extends VuexModule {
  errors: Array<Error> = [];

  @Mutation
  addError(error: Error): void {
    this.errors.push(error);
  }

  @Mutation
  clearErrors(): void {
    this.errors = [];
  }
}