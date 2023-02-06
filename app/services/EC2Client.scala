package services

import com.amazonaws.regions.{Region, Regions}
import com.amazonaws.services.ec2.AmazonEC2ClientBuilder
import com.amazonaws.services.ec2.model.{DescribeTagsRequest, Filter}
import com.amazonaws.util.EC2MetadataUtils

import scala.jdk.CollectionConverters._


object EC2Client {
  lazy val region = Option(Regions.getCurrentRegion).getOrElse(Region.getRegion(Regions.EU_WEST_1))

  lazy val EC2Client = AmazonEC2ClientBuilder.standard().withRegion(region.getName).build()
}

trait AwsInstanceTags {
  lazy val instanceId = Option(EC2MetadataUtils.getInstanceId)

  def readTag(tagName: String) = {
    instanceId.flatMap { id =>
      val tagsResult = EC2Client.EC2Client.describeTags(
        new DescribeTagsRequest().withFilters(
          new Filter("resource-type").withValues("instance"),
          new Filter("resource-id").withValues(id),
          new Filter("key").withValues(tagName)
        )
      )
      tagsResult.getTags.asScala.find(_.getKey == tagName).map(_.getValue)
    }
  }
}