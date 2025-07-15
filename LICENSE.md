
# License Information

## 📋 License Overview

This project is licensed under the **Apache License 2.0**, which provides extensive permissions for use, modification, and distribution while maintaining appropriate attribution requirements.

## 🎯 License Flow Diagram

```mermaid
graph TD
    subgraph "Apache 2.0 Permissions"
        Use[✅ Commercial Use]
        Modify[✅ Modification]
        Distribute[✅ Distribution]
        Patent[✅ Patent Use]
        Private[✅ Private Use]
    end

    subgraph "Requirements"
        License[📄 Include License]
        Copyright[©️ Include Copyright]
        Changes[📝 State Changes]
        Notice[📢 Include NOTICE]
    end

    subgraph "Limitations"
        Liability[❌ No Liability]
        Warranty[❌ No Warranty]
        Trademark[❌ No Trademark Use]
    end

    subgraph "Usage Scenarios"
        Fork[Fork Repository]
        Clone[Clone for Personal Use]
        Deploy[Deploy Portfolio]
        Contribute[Contribute Code]
        Commercial[Commercial Usage]
    end

    Fork --> License
    Fork --> Copyright
    Fork --> Changes
    Clone --> License
    Deploy --> License
    Deploy --> Copyright
    Contribute --> License
    Commercial --> License
    Commercial --> Copyright
    Commercial --> Changes

    License --> Use
    License --> Modify
    License --> Distribute

    classDef permission fill:#10b981,stroke:#059669,color:#fff
    classDef requirement fill:#f59e0b,stroke:#d97706,color:#fff
    classDef limitation fill:#ef4444,stroke:#dc2626,color:#fff
    classDef scenario fill:#3b82f6,stroke:#1e40af,color:#fff

    class Use,Modify,Distribute,Patent,Private permission
    class License,Copyright,Changes,Notice requirement
    class Liability,Warranty,Trademark limitation
    class Fork,Clone,Deploy,Contribute,Commercial scenario
```

## 🚀 Quick Start for Users

```mermaid
flowchart LR
    Start([Want to use this portfolio?]) --> Decision{Usage Type}

    Decision --> Personal[Personal Portfolio]
    Decision --> Fork[Fork & Customize]
    Decision --> Commercial[Commercial Use]
    Decision --> Contribute[Contribute Back]

    Personal --> Steps1[1. Clone Repository<br/>2. Keep LICENSE file<br/>3. Update settings.json<br/>4. Deploy]

    Fork --> Steps2[1. Fork on GitHub<br/>2. Keep LICENSE & Copyright<br/>3. Document changes<br/>4. Customize freely]

    Commercial --> Steps3[1. Include Apache 2.0 License<br/>2. Maintain copyright notices<br/>3. Document modifications<br/>4. Use commercially]

    Contribute --> Steps4[1. Fork repository<br/>2. Make improvements<br/>3. Submit pull request<br/>4. Follow contribution guidelines]

    Steps1 --> Success[✅ Ready to Go!]
    Steps2 --> Success
    Steps3 --> Success
    Steps4 --> Success

    classDef decision fill:#8b5cf6,stroke:#7c3aed,color:#fff
    classDef usage fill:#3b82f6,stroke:#1e40af,color:#fff
    classDef steps fill:#10b981,stroke:#059669,color:#fff
    classDef success fill:#f59e0b,stroke:#d97706,color:#fff

    class Decision decision
    class Personal,Fork,Commercial,Contribute usage
    class Steps1,Steps2,Steps3,Steps4 steps
    class Success success
```

## 📝 What You Can Do

| **Permission**       | **Description**               | **Example Use Case**                              |
| -------------------- | ----------------------------- | ------------------------------------------------- |
| ✅ **Commercial Use** | Use for commercial projects   | Build client portfolios, sell customized versions |
| ✅ **Modification**   | Modify the source code        | Add new features, change design, integrate APIs   |
| ✅ **Distribution**   | Share your modified version   | Release on GitHub, package for others             |
| ✅ **Patent Use**     | Use any patents in the code   | Full legal protection for implementation          |
| ✅ **Private Use**    | Use privately without sharing | Internal company portfolios, personal projects    |

## 📋 What You Must Do

| **Requirement**         | **Description**                | **How to Comply**                           |
| ----------------------- | ------------------------------ | ------------------------------------------- |
| 📄 **Include License**   | Keep the Apache 2.0 license    | Don't remove `LICENSE.md` file              |
| ©️ **Include Copyright** | Maintain copyright notices     | Keep existing copyright headers in files    |
| 📝 **State Changes**     | Document your modifications    | Add comments or changelog for major changes |
| 📢 **Include NOTICE**    | Include NOTICE file if present | Keep any NOTICE file from original project  |

## ❌ What You Cannot Do

| **Limitation**         | **Description**                       | **Explanation**                             |
| ---------------------- | ------------------------------------- | ------------------------------------------- |
| ❌ **No Liability**     | Authors not responsible for damages   | Use at your own risk                        |
| ❌ **No Warranty**      | No guarantee the code works perfectly | Test thoroughly before production use       |
| ❌ **No Trademark Use** | Cannot use project/author trademarks  | Don't claim endorsement by original authors |

## 🎯 Common Usage Examples

### 1. **Personal Portfolio** (Most Common)
```bash
# Simple case - just customize and deploy
git clone https://github.com/VKrishna04/VKrishna04.github.io.git my-portfolio
cd my-portfolio
# Edit settings.json with your information
# Keep LICENSE.md file
npm install && npm run build
```

### 2. **Fork for Customization**
```bash
# Fork on GitHub first, then:
git clone https://github.com/YOUR_USERNAME/YOUR_PORTFOLIO_FORK.git
cd YOUR_PORTFOLIO_FORK
# Make your changes
# Keep LICENSE.md and add changelog
git commit -m "Customized for my portfolio - added new sections"
```

### 3. **Commercial/Client Use**
```bash
# For building client portfolios
git clone https://github.com/VKrishna04/VKrishna04.github.io.git client-portfolio
cd client-portfolio
# Customize for client
# Keep LICENSE.md file
# Document major changes in README or CHANGELOG
```

## 📞 Questions About Licensing?

- **Can I remove the license?** No, Apache 2.0 requires keeping the license
- **Can I sell this?** Yes, commercial use is explicitly allowed
- **Can I modify anything?** Yes, full modification rights
- **Do I need to share my changes?** No, but it's appreciated
- **Can I use this for clients?** Yes, perfect for commercial client work

---

                                 Apache License
                           Version 2.0, January 2004
                        http://www.apache.org/licenses/

   TERMS AND CONDITIONS FOR USE, REPRODUCTION, AND DISTRIBUTION

   1. Definitions.

      "License" shall mean the terms and conditions for use, reproduction,
      and distribution as defined by Sections 1 through 9 of this document.

      "Licensor" shall mean the copyright owner or entity authorized by
      the copyright owner that is granting the License.

      "Legal Entity" shall mean the union of the acting entity and all
      other entities that control, are controlled by, or are under common
      control with that entity. For the purposes of this definition,
      "control" means (i) the power, direct or indirect, to cause the
      direction or management of such entity, whether by contract or
      otherwise, or (ii) ownership of fifty percent (50%) or more of the
      outstanding shares, or (iii) beneficial ownership of such entity.

      "You" (or "Your") shall mean an individual or Legal Entity
      exercising permissions granted by this License.

      "Source" form shall mean the preferred form for making modifications,
      including but not limited to software source code, documentation
      source, and configuration files.

      "Object" form shall mean any form resulting from mechanical
      transformation or translation of a Source form, including but
      not limited to compiled object code, generated documentation,
      and conversions to other media types.

      "Work" shall mean the work of authorship, whether in Source or
      Object form, made available under the License, as indicated by a
      copyright notice that is included in or attached to the work
      (an example is provided in the Appendix below).

      "Derivative Works" shall mean any work, whether in Source or Object
      form, that is based on (or derived from) the Work and for which the
      editorial revisions, annotations, elaborations, or other modifications
      represent, as a whole, an original work of authorship. For the purposes
      of this License, Derivative Works shall not include works that remain
      separable from, or merely link (or bind by name) to the interfaces of,
      the Work and Derivative Works thereof.

      "Contribution" shall mean any work of authorship, including
      the original version of the Work and any modifications or additions
      to that Work or Derivative Works thereof, that is intentionally
      submitted to Licensor for inclusion in the Work by the copyright owner
      or by an individual or Legal Entity authorized to submit on behalf of
      the copyright owner. For the purposes of this definition, "submitted"
      means any form of electronic, verbal, or written communication sent
      to the Licensor or its representatives, including but not limited to
      communication on electronic mailing lists, source code control systems,
      and issue tracking systems that are managed by, or on behalf of, the
      Licensor for the purpose of discussing and improving the Work, but
      excluding communication that is conspicuously marked or otherwise
      designated in writing by the copyright owner as "Not a Contribution."

      "Contributor" shall mean Licensor and any individual or Legal Entity
      on behalf of whom a Contribution has been received by Licensor and
      subsequently incorporated within the Work.

   2. Grant of Copyright License. Subject to the terms and conditions of
      this License, each Contributor hereby grants to You a perpetual,
      worldwide, non-exclusive, no-charge, royalty-free, irrevocable
      copyright license to reproduce, prepare Derivative Works of,
      publicly display, publicly perform, sublicense, and distribute the
      Work and such Derivative Works in Source or Object form.

   3. Grant of Patent License. Subject to the terms and conditions of
      this License, each Contributor hereby grants to You a perpetual,
      worldwide, non-exclusive, no-charge, royalty-free, irrevocable
      (except as stated in this section) patent license to make, have made,
      use, offer to sell, sell, import, and otherwise transfer the Work,
      where such license applies only to those patent claims licensable
      by such Contributor that are necessarily infringed by their
      Contribution(s) alone or by combination of their Contribution(s)
      with the Work to which such Contribution(s) was submitted. If You
      institute patent litigation against any entity (including a
      cross-claim or counterclaim in a lawsuit) alleging that the Work
      or a Contribution incorporated within the Work constitutes direct
      or contributory patent infringement, then any patent licenses
      granted to You under this License for that Work shall terminate
      as of the date such litigation is filed.

   4. Redistribution. You may reproduce and distribute copies of the
      Work or Derivative Works thereof in any medium, with or without
      modifications, and in Source or Object form, provided that You
      meet the following conditions:

      (a) You must give any other recipients of the Work or
          Derivative Works a copy of this License; and

      (b) You must cause any modified files to carry prominent notices
          stating that You changed the files; and

      (c) You must retain, in the Source form of any Derivative Works
          that You distribute, all copyright, patent, trademark, and
          attribution notices from the Source form of the Work,
          excluding those notices that do not pertain to any part of
          the Derivative Works; and

      (d) If the Work includes a "NOTICE" text file as part of its
          distribution, then any Derivative Works that You distribute must
          include a readable copy of the attribution notices contained
          within such NOTICE file, excluding those notices that do not
          pertain to any part of the Derivative Works, in at least one
          of the following places: within a NOTICE text file distributed
          as part of the Derivative Works; within the Source form or
          documentation, if provided along with the Derivative Works; or,
          within a display generated by the Derivative Works, if and
          wherever such third-party notices normally appear. The contents
          of the NOTICE file are for informational purposes only and
          do not modify the License. You may add Your own attribution
          notices within Derivative Works that You distribute, alongside
          or as an addendum to the NOTICE text from the Work, provided
          that such additional attribution notices cannot be construed
          as modifying the License.

      You may add Your own copyright statement to Your modifications and
      may provide additional or different license terms and conditions
      for use, reproduction, or distribution of Your modifications, or
      for any such Derivative Works as a whole, provided Your use,
      reproduction, and distribution of the Work otherwise complies with
      the conditions stated in this License.

   5. Submission of Contributions. Unless You explicitly state otherwise,
      any Contribution intentionally submitted for inclusion in the Work
      by You to the Licensor shall be under the terms and conditions of
      this License, without any additional terms or conditions.
      Notwithstanding the above, nothing herein shall supersede or modify
      the terms of any separate license agreement you may have executed
      with Licensor regarding such Contributions.

   6. Trademarks. This License does not grant permission to use the trade
      names, trademarks, service marks, or product names of the Licensor,
      except as required for reasonable and customary use in describing the
      origin of the Work and reproducing the content of the NOTICE file.

   7. Disclaimer of Warranty. Unless required by applicable law or
      agreed to in writing, Licensor provides the Work (and each
      Contributor provides its Contributions) on an "AS IS" BASIS,
      WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
      implied, including, without limitation, any warranties or conditions
      of TITLE, NON-INFRINGEMENT, MERCHANTABILITY, or FITNESS FOR A
      PARTICULAR PURPOSE. You are solely responsible for determining the
      appropriateness of using or redistributing the Work and assume any
      risks associated with Your exercise of permissions under this License.

   8. Limitation of Liability. In no event and under no legal theory,
      whether in tort (including negligence), contract, or otherwise,
      unless required by applicable law (such as deliberate and grossly
      negligent acts) or agreed to in writing, shall any Contributor be
      liable to You for damages, including any direct, indirect, special,
      incidental, or consequential damages of any character arising as a
      result of this License or out of the use or inability to use the
      Work (including but not limited to damages for loss of goodwill,
      work stoppage, computer failure or malfunction, or any and all
      other commercial damages or losses), even if such Contributor
      has been advised of the possibility of such damages.

   9. Accepting Warranty or Additional Liability. While redistributing
      the Work or Derivative Works thereof, You may choose to offer,
      and charge a fee for, acceptance of support, warranty, indemnity,
      or other liability obligations and/or rights consistent with this
      License. However, in accepting such obligations, You may act only
      on Your own behalf and on Your sole responsibility, not on behalf
      of any other Contributor, and only if You agree to indemnify,
      defend, and hold each Contributor harmless for any liability
      incurred by, or claims asserted against, such Contributor by reason
      of your accepting any such warranty or additional liability.

   END OF TERMS AND CONDITIONS

   APPENDIX: How to apply the Apache License to your work.

      To apply the Apache License to your work, attach the following
      boilerplate notice, with the fields enclosed by brackets "[]"
      replaced with your own identifying information. (Don't include
      the brackets!)  The text should be enclosed in the appropriate
      comment syntax for the file format. We also recommend that a
      file or class name and description of purpose be included on the
      same "printed page" as the copyright notice for easier
      identification within third-party archives.

   Copyright [2025]() [Krishna GSVV](https://github.com/VKrishna04)

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
