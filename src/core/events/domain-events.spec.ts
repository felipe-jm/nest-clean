import { AggregateRoot } from "../entities/aggregate-root";
import { UniqueEntityId } from "../entities/unique-entity-id";
import { DomainEvent } from "./domain-event";
import { DomainEvents } from "./domain-events";

class CustomAggregateCreatedEvent implements DomainEvent {
  public ocurredAt: Date;
  private aggregate: CustomAggregate;

  constructor(aggregate: CustomAggregate) {
    this.ocurredAt = new Date();
    this.aggregate = aggregate;
  }

  public getAggregateId(): UniqueEntityId {
    return this.aggregate.id;
  }
}

class CustomAggregate extends AggregateRoot<{
  name: string;
}> {
  static create(name: string) {
    const aggregate = new CustomAggregate({ name });

    aggregate.addDomainEvent(new CustomAggregateCreatedEvent(aggregate));

    return aggregate;
  }
}

describe("Domain events tests", () => {
  it("should be able to dispatch and listen to events", () => {
    const callbackSpy = vi.fn();

    // Subscriber cadastrado (ouvindo o evento de "resposta criada")
    DomainEvents.register(callbackSpy, CustomAggregateCreatedEvent.name);

    // Estou criando uma resposta, porém SEM salvar no banco de dados
    const aggregate = CustomAggregate.create("test");

    // Estou assegurando que o evento foi criado, porém NÃO foi disparado
    expect(aggregate.domainEvents.length).toBe(1);

    // Estou salvando a resposta no banco de dados e disparando o evento
    DomainEvents.dispatchEventsForAggregate(aggregate.id);

    // O subscriber ouve o evento e faz o que precisa ser feito com o dado
    expect(callbackSpy).toHaveBeenCalled();
    expect(aggregate.domainEvents.length).toBe(0);
  });
});
