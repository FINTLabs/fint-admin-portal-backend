package no.fint.portal.admin.k8s.model

import spock.lang.Specification

class ComponentConfigurationSpec extends Specification {

    def "JSON ComponentConfigurations object should be deserialized"() {
        given:
        def json = "[{\"environment\":\"beta\",\"image\":\"fintlabsacr.azurecr.io/consumer-okonomi-faktura:3.9.0\",\"cacheDisabledFor\":[\"test\",\"test\"],\"sizes\":{\"small\":{\"limit\":{\"memory\":\"2Gi\",\"cpu\":\"1\"},\"request\":{\"memory\":\"512Mi\",\"cpu\":\"250m\"}},\"medium\":{\"limit\":{\"memory\":\"4Gi\",\"cpu\":\"2\"},\"request\":{\"memory\":\"2\",\"cpu\":\"500\"}},\"large\":{\"limit\":{\"memory\":\"6Gi\",\"cpu\":\"3\"},\"request\":{\"memory\":\"4Gi\",\"cpu\":\"2\"}}}},{\"environment\":\"api\",\"image\":\"fintlabsacr.azurecr.io/consumer-okonomi-faktura:3.8.0\",\"cacheDisabledFor\":[\"test\",\"test\"],\"sizes\":{\"small\":{\"limit\":{\"memory\":\"2Gi\",\"cpu\":\"1\"},\"request\":{\"memory\":\"512Mi\",\"cpu\":\"250m\"}},\"medium\":{\"limit\":{\"memory\":\"4Gi\",\"cpu\":\"2\"},\"request\":{\"memory\":\"2\",\"cpu\":\"500\"}},\"large\":{\"limit\":{\"memory\":\"6Gi\",\"cpu\":\"3\"},\"request\":{\"memory\":\"4Gi\",\"cpu\":\"2\"}}}}]"

        when:
        def deserialize = ComponentConfiguration.deserialize(json)

        then:
        deserialize.isPresent()
        deserialize.get().size() == 2
        deserialize.get()[0].getEnvironment() == "beta"
        deserialize.get()[1].getEnvironment() == "api"
    }
}
