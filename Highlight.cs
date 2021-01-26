using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BlazorEpub
{
    public class Highlight
    {
        public int Id { get; set; }

        [Display(Name = "رنگ هایلایت")]
        public string HighlightColor { get; set; }


        [Display(Name = "متن هایلایت")]
        public string HighlightText { get; set; }

        [Display(Name = "یادداشت")]
        public string Note { get; set; }


        [Display(Name = "آدرس صفحه")]
        public string HrefBook { get; set; }


        [Display(Name = "آدرس هایلایت")]
        public string CfiRange { get; set; }

        [Display(Name = "شماره صفحه")]
        public int PageNumber { get; set; }

        public bool IsAnnotation { get; set; }
    }
}
