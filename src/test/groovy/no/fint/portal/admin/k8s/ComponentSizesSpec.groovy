package no.fint.portal.admin.k8s


import com.fasterxml.jackson.databind.ObjectMapper
import spock.lang.Specification

class ComponentSizesSpec extends Specification {

    def mapper
    def componentSizesJson

    void setup() {
        componentSizesJson = "{\"small\":{\"limit\":{\"memory\":\"2Gi\",\"cpu\":\"1\"},\"request\":{\"memory\":\"512Mi\",\"cpu\":\"250m\"}},\"medium\":{\"limit\":{\"memory\":\"4Gi\",\"cpu\":\"2\"},\"request\":{\"memory\":\"2\",\"cpu\":\"500\"}},\"large\":{\"limit\":{\"memory\":\"6Gi\",\"cpu\":\"3\"},\"request\":{\"memory\":\"4Gi\",\"cpu\":\"2\"}}}"
        mapper = new ObjectMapper()
    }

    def "JSON size object should be deserialized"() {

        when:
        def componentSizes = mapper.readValue(componentSizesJson, ComponentSizes.class)

        then:
        componentSizes
        componentSizes.getSmall()
        componentSizes.getMedium()
        componentSizes.getLarge()

    }

    def "Get size by string"() {
        given:
        def componentSizes = mapper.readValue(componentSizesJson, ComponentSizes.class)

        when:
        def small = componentSizes.getSize("small")
        def medium = componentSizes.getSize("medium")
        def large = componentSizes.getSize("large")

        then:
        small.isPresent()
        medium.isPresent()
        large.isPresent()
    }
}
